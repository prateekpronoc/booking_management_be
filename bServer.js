const express = require("express");
const cors = require("cors");
let config = require('config'); const app = express();
var _ = require('./startup/load-lodash')();
var Promise = require('bluebird');

var corsOptions = {
    origin: "*"
};
console.log(config);
const db = require("./models");
db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });
// console.log(db);
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());



// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
console.log(config);
app.use(require('express-bunyan-logger')({
    name: 'logger',
    streams: [{
        path: config.logFolder + '/' + ('') + 'wowcarz.log',
        type: 'rotating-file',
        level: 'debug',
        period: '1d', // daily rotation
        count: 3 // keep 3 back copies
    }, {
        path: config.logFolder + '/' + ('') + 'wowcarz-err.log',
        type: 'rotating-file',
        level: 'warn',
        period: '1d', // daily rotation
        count: 3 // keep 3 back copies
    }]
}));


// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Booking System." })

});
config.Promise = Promise;
let logger = require('./startup/load-logger')(config);
require('./startup/load-kue')(config).then((queueInfo) => {
    config = _.merge(config, queueInfo);
    console.log(config);
    config.logger = logger;
    config.modelKeys = require('./data-config/data-model.json').modelTables;
    
    config.backgroundWorker = require('./background-server/background-worker')(config, _, db);
    // queueInfo
}).then(()=>{
    // config.queue.create('email', {
    //     to: 'data.entity.customerEmail',
    //     tenant: 1,
    //     data: {
    //       order: 'data.entity',
    //       watcherEmail:  'prateekforwork@gmail.com',
    //       user: 'data.entity.user'
    //     },
    //     subject: 'Booking Confirmation - ',
    //     bcc: 'config.watcherEmails',
    //     template: 'booking-confirmation'
    //   }).removeOnComplete(true).save();
});



// config.modelKeys = require('./data-config/data-model.json').modelTables;
// config.Promise = Promise;
// config.backgroundWorker = require('./background-server/background-worker')(config, _, db);
// config.crypto = crypto;

app.use(function (req, res, next) {
    req.config = config;
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    // app.use(function(req, res, next) {
    req.log.debug('this is debug in middleware');
    //     next();
    // });
    req.log.info('.getAllEntities : Params = ', req.params);
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }

    // Assign the config to the req object
    req.config = config;


    req.setTimeout(500000, function () {
        // call back function is called when request timed out.
    });
    next();
});



// set port, listen for requests
const PORT = process.env.PORT || 9096;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// config.backgroundWorker = require('./backgroundworker')(config, _, database);