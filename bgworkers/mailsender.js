'use strict';

// var emailer = require('emailjs');
// var handleBars = require('handlebars');
// var nodemailer = require('nodemailer'),
//     mime = require('mime-types'),
//     ses = require('nodemailer-ses-transport');
// smtpTransport = require('nodemailer-smtp-transport');
module.exports = function(queue, database, _, config) {
    return function(){
        console.log('testing!!!!!');
        return config.Promise.resolve({});
    }
    // return config.Promise.resolve({});
    // var path = require('path'),
    //     fs = require('fs'),
    //     templates = {};
    // fs.readdir(config.templatesFolder + '/emails', function(err, files) {
    //     if (err) {
    //         config.logger.error('Error reading the Email templates from templates directory ', err);
    //         return;
    //     }
    //     _.forEach(files, function(file) {
    //         fs.readFile(config.templatesFolder + '/emails/' + file, function(err, data) {
    //             templates[path.parse(file).name] = config.handleBars.compile(data.toString('utf-8'));
    //         });
    //     });
    // });
    // var emailConfigs = config.mailConfigs;
    console.log('emailConfigs');
    // ,
    //     aws: {
    //         host: 'email-smtp.us-west-2.amazonaws.com',
    //         ignoreTLS: false,
    //         tls: {
    //             rejectUnauthorized: true
    //         },
    //         auth: {
    //             user: 'AKIAJRIMA6EDA3HTO36A',
    //             pass: 'AmCUo89T1LgnPs2IlNw8VG8ajHxPU7dvH5fu7PWynDVK'
    //         }
    //     }

    // return function(database, data, req) {
    //     req.log.info('mailSender: Job Received: ', data);
    //     if (!data || !data.tenant || (!data.to && !data.cc && !data.bcc)) {
    //         req.log.error('mailSender: No Tenant Information or Emails of recipients found!');
    //         throw new Error('mailSender: No Tenant Information or Emails of recipients found!');
    //     }
    //     if (!data.template && !data.contents) {
    //         req.log.error('mailSender: No Template or content found in the Email Request');
    //         throw new Error('mailSender: No Template or content found in the Email Request');
    //     }
    //     if (data.template && !templates[data.tenant + '-' + data.template] && !templates[data.template]) {
    //         req.log.error('mailSender: No template found with code : ' + data.template);
    //         throw new Error('mailSender: No template found with code : ' + data.template);
    //     }
    //     return resolveUsers(data, req).then((userEmails) => {
    //         data.to = userEmails;
    //         return sendEmail(data, req);
    //     });
    // };

    // function resolveUsers(data, req) {
    //     if (data.to) {
    //         var toArr = _.flatten([data.to]);
    //         var parsed = _.map(toArr, _.parseInt);
    //         if (parsed.legth === toArr.length) {
    //             return database.users.findAll({ where: { id: { $in: parsed }, isInvalidEmail: false }, attributes: ['email'] }).then((usrs) => {
    //                 config.req.log.info('mailSender: resolveUsers: Users = ', _.map(usrs, 'dataValeus'));
    //                 return config.Promise.resolve(_.compact(_.map(_.map(usrs, 'dataValues'), 'email')));
    //             });
    //         }
    //     }
    //     return config.Promise.resolve(data.to);
    // }

    // function sendEmail(data, req) {
    //     return new config.Promise((resolve, reject) => {
    //         req.log.info('mailSender: Rendering the template');
    //         if (!data.data.contactEmail) {
    //             data.data.contactEmail = config.contactEmail ? config.contactEmail : 'prateekforwork@gmail.com';
    //         }
    //         if (!data.data.productName) {
    //             data.data.productName = config.productName ? config.productName : 'WOwCarz';
    //         }
    //         var contents = data.contents;
    //         if (data.template) {
    //             var compiled = data.template ? templates[data.tenant + '-' + data.template] ?
    //                 templates[data.tenant + '-' + data.template] :
    //                 templates[data.template] : config.handleBars.compile(data.content.toString('utf-8'));
    //             req.log.info('mailSender: Data to fill in : ', data.data);
    //             contents = compiled(data.data);
    //             req.log.info('mailSender: After filling data....');
    //         }

    //         var mailConfig = emailConfigs[data.tenant] ? emailConfigs[data.tenant] : emailConfigs.hirepro;
    //         req.log.info('mailSender: Email Config : ', mailConfig);
    //         if (mailConfig.debug) {
    //             mailConfig = _.clone(mailConfig);
    //             mailConfig.logger = config.logger;
    //         }
    //         var server = nodemailer.createTransport(mailConfig);
    //         // var pas='HirePro@1234';
    //         // var server = nodemailer.createTransport('smtps://noreply@indiqube.com:pass@smtp.gmail.com');
    //         // var server = emailConfigs[data.tenant] ? nodemailer.createTransport(emailConfigs[data.tenant]) : nodemailer.createTransport(ses({
    //         //     accessKeyId: 'AKIAJK3LCY7PG5LGOFAA',
    //         //     secretAccessKey: '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'
    //         // }));
    //         var mailMsg = {
    //             html: contents,
    //             from: _.has(data, 'from') ? data.from : mailConfig.auth.user || 'info@hcube.in',
    //             domain: 'hcube.in',
    //             subject: data.subject
    //         };
    //         mailMsg = _.merge(mailMsg, _.pick(data, ['to', 'cc', 'bcc']));
    //         if (data.data.attachments) {
    //             req.log.info('mailSender: Attaching attachments', data.data.attachments);
    //             mailMsg.attachments = _.map(data.data.attachments, (filePath) => {
    //                 req.log.info('mailSender: Attachment : ' + filePath + ' Mime = ' + mime.lookup(path.parse(filePath).base));
    //                 return {
    //                     path: filePath,
    //                     contentType: mime.lookup(path.parse(filePath).base)
    //                 };
    //             });
    //         }
    //         // if (data.data.invite) {
    //         //     req.log.info('mailSender: Adding calendar invite ');
    //         //     mailMsg.alternatives = [{
    //         //         content: data.data.invite,
    //         //         contentType: 'text/calendar'
    //         //     }];
    //         // }
    //         req.log.info('mailSender: Adding watcher emails');
    //         if (config.watcherEmails) {
    //             mailMsg.bcc = _.merge(mailMsg.bcc || [], config.watcherEmails);
    //         }
    //         req.log.info('mailSender: Sending Email : ', mailMsg);
    //         server.sendMail(mailMsg, function(err, res) {
    //             req.log.info('mailSender: Got Email Response : ', {
    //                 err: err,
    //                 message: mailMsg,
    //                 res: res
    //             });
    //             let obj = {
    //                 message: mailMsg.html.length > 6000 ? mailMsg.html.substring(0, 5998) : mailMsg.html,
    //                 to: mailMsg.to,
    //                 id: data.notificationId,
    //                 status: 'success',
    //                 statusMessage: null
    //             };
    //             if (err) {
    //                 obj.status = 'failed';
    //                 obj.statusMessage = JSON.stringify(err);
    //             }
    //             req.log.info('mailSender: Update notification initiated : ', obj);
    //             config.services.commonUpdateNotification(database, obj).then((data) => {
    //                 req.log.info('mailSender: Update Notifications Done...');
    //             });
    //             if (err) {
    //                 return reject(err);
    //             }
    //             return resolve(res);
    //         });
    //         req.log.info('mailSender: Mail initiated');
    //         return config.Promise.resolve({});
    //     });
    // }
};
