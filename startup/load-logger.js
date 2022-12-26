'use strict';
module.exports = function(config, prefix) {
  console.log(config.logFolder);
  var bunyan = require('bunyan'),
    // rollbar = require('rollbar'),
    // bunyanRollbar = require('bunyan-rollbar'),
    // BunyanSlack = require('bunyan-slack'),
   
    streams = [{
      path: config.logFolder + '/' + ('')  + 'booking-system.log',
      type: 'rotating-file',
      level: 'debug',
      period: '1d', // daily rotation
      count: 3 // keep 3 back copies
    }, {
      path: config.logFolder + '/' + (prefix || '') + 'wowcarz-err.log',
      type: 'rotating-file',
      level: 'warn',
      period: '1d', // daily rotation
      count: 3 // keep 3 back copies
    }];
  if (config.useRingBuffer) {
    const ringBuffer = new bunyan.RingBuffer({ limit: 1000 });
    streams.push({
      level: 'debug',
      type: 'raw',
      stream: ringBuffer
    });
  }
  if (config.rollbarToken) {
    rollbar.init(config.rollbarToken, { environment: process.env.NODE_ENV });
    streams.push({
      level: 'fatal',
      type: 'raw', // Must be set to raw for use with BunyanRollbar 
      stream: new bunyanRollbar.Stream({
        rollbarToken: config.rollbarToken,
        rollbarOptions: {} // Additional options to pass to rollbar.init() 
      }),
    });
  }
  if (config.slack) {
    streams.push({
      stream: new BunyanSlack(config.slack),
      type: 'raw',
      level: 'error'
    });
  }
  if (config.mongoDb) {
    var mongoInfo = require('../utils/mongo-log-model')(config.mongoDb.host, config.mongoDb.dbName, config.mongoDb.port)();
    if (mongoInfo && mongoInfo.modelName) {
      var LogEntryModel = mongoInfo.mongoose.model(mongoInfo.modelName, mongoInfo.schema);
      var LogEntryStream = require('bunyan-mongodb-stream')({ model: LogEntryModel });
      console.log('Loading the mongo stream....');
      streams.push({
        stream: LogEntryStream,
        level: 'debug'
      });
    }
  }
  var logger = bunyan.createLogger({
    name: 'wowcarz',
    src: true,
    streams: streams,
    pid: process.pid
  });
  if (config.useRingBuffer) {
    logger.ringBuffer = ringBuffer;
  }
  return logger;
};
