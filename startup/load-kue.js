'use strict';
module.exports = function(config) {
    var kue = require('kue'),
        queue = kue.createQueue({
            prefix: 'queue',
            redis: config.redis
        });
    queue.on('error', function(err) {
        console.log('Kue Queue Error: ' + err, {
            redis: config.redis,
            err: err,
            stack: err.stack || err
        });
    }).on('job enqueue', function(id, type) {
        console.log('Job %s got queued of type %s', id, type);
    });

    queue.watchStuckJobs(30000);
    process.once('SIGTERM', function(sig) {
        config.logger.info('Signal received for Termination : ' + sig);
        queue.shutdown(5000, function(err) {
            console.log('Kue shutdown: ', err || '');
            process.exit(0);
        });
    });

    process.on('exit', function(err) {
        config.logger.info('Exiting the process ' + err);
        queue.shutdown(5000, function(err) {
            config.logger.info('Kue shutdown: ', err || '');
            process.exit(0);
        });
    });

    // kue.app.listen((config.post || 9090) + 1);
    return config.Promise.resolve({ kue: kue, queue: queue });
};
