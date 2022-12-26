'use strict';

module.exports = function(config, _, sequelize) {
    var queue = config.queue,
        uuid = require('node-uuid'),
        sysUser;
    var backgroundWorkers = require('../data-config/app-preferences.json').backgroundWorkers,
        bgWorkers;
    require('../startup/load-files')(config, _)('../bgworkers', (_, module) => {
        return module(queue, sequelize, _, config);
    }).then((bgw) => {
        bgWorkers = bgw;
        return sequelize.users.findOne({ where: {  username: 'prateek@wowcarz.in'   }});
    }).then((usrs) => {
        var user = usrs && _.isArray(usrs) ? usrs[0] : usrs;
        if (!user) {
            config.logger.error('backgroundWorker: Invalid User found for superadmin!');
            return;
        }
        sysUser = _.omit(user.dataValues || user, ['password']);
        queue.on('job enqueue', function(id, type) {
            config.logger.info('Job %s got queued of type %s', id, type);
        }).on('job complete', function(id, result) {
            console.log('Job Completed : ' + id + ' Result = ' + result);
            config.kue.Job.get(id, function(err, job) {
                if (err) {
                    return;
                }
                job.remove(function(err) {
                    if (err) {
                        throw err;
                    }
                    config.logger.info('removed completed job #%d', job.id);
                });
            });
        });
        _.forOwn(backgroundWorkers, (cfg, key) => {
            console.log('backgroundWorker: Processing ' + key);
            queue.process(key, cfg.concurrency || 1, (job, context, done) => {
                console.log('backgroundWorker: New Job(' + key + ') with id: ' + job.id + ' received for processing. Data = ', job.data);
                config.Promise.try(() => {
                    if (!cfg.notify) {
                        return config.Promise.resolve({});
                    }
                    // return (!cfg.notifyPreProcessor ? config.Promise.resolve(data) : config.services[_.camelCase(cfg.notifyPreProcessor)](sequelize, job)).then((job) => {
                    //     return config.services.commonCreateNotification(sequelize, job);
                    // });
                    return config.Promise.resolve({});
                }).then((notifyData) => {
                    // config.logger.info('backgroundWorker: notifyData: ', notifyData);
                    // if (notifyData && notifyData.id) {
                    //     job.data.notificationId = notifyData.id;
                    // }
                    console.log(cfg.service)
                    return processJob(job.data, job, context, bgWorkers[_.camelCase(cfg.service)], key);
                }).then((result) => {
                    console.log('backgroundWorker: Job(' + key + ')(' + job.id + ') completed: Result = ', { job: job.id, jobType: key, data: job.data, result: result });
                    done();
                }).catch( (err) => {
                    console.log('backgroundWorker: DatabaseError: Job(' + key + ')(' + job.id + ') failed to complete: ' + err, JSON.stringify({ job: job.id, jobType: key, data: job.data, err: err, stack: err.stack || err, bgWorkerConfig: backgroundWorkers, serviceName: _.camelCase(cfg.service), loadedBgWorkers: bgWorkers }));
                    if (err.message.indexOf('ER_LOCK_WAIT_TIMEOUT') > -1) {
                        config.log('backgroundWorker: Pausing Queue ' + key);
                        config.handleMessage('DatabaseLockError : ' + key + ' ' + err, {
                            jobName: key,
                            data: job.data,
                            job: job.id,
                            err: err,
                            stack: err.stack || err
                        });
                        context.pause(5000, (newErr) => {
                            if (newErr) {
                                console.log('backgroundWorker: Error pausing the queue: ' + key + ' Err = ', err);
                                config.handleMessage('DatabaseLockPauseError : ' + key + ' ' + err, {
                                    jobName: key,
                                    data: job.data,
                                    job: job.id,
                                    err: newErr,
                                    stack: newErr.stack || newErr,
                                    parent: err
                                });
                            }
                            setTimeout(() => {
                                config.logger.info('backgroundWoker: Restarting Queue: ' + new Date());
                                context.resume();
                            }, 60000);
                        });
                    }
                    done(err);
                }).catch((err) => {
                    console.log('backgroundWorker: Job(' + key + ')(' + job.id + ') failed to complete: ' + err, JSON.stringify({ job: job.id, jobType: key, data: job.data, err: err, stack: err.stack || err, bgWorkerConfig: backgroundWorkers, serviceName: _.camelCase(cfg.service), loadedBgWorkers: bgWorkers }));
                    done(err);
                });
            });
        });
    });


    function processJob(data, job, context, service, serviceName) {
        if (!service) {
            throw new Error('Invalid Service specified');
        }
        var req = {
            log: console.log({ req_id: uuid.v1(), jobType: _.camelCase(serviceName) }),
            database: sequelize,
            user: data.user || sysUser
        };
        console.log('backgroundWorker: processJob: ' + serviceName);
        return service(sequelize, data, req);
    }
    return function() {};
};