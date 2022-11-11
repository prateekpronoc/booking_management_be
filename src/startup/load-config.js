'use strict';
module.exports = function(cfg, logger, _) {
    var Promise = require('bluebird');
        // rollbar = require('rollbar');
    // if (cfg.rollbarToken) {
    //     rollbar.init(cfg.rollbarToken, { environment: process.env.NODE_ENV });
    //     rollbar.handleUncaughtExceptions();
    // }
    // var utilsPath = '../utils/',
    //     rootPath = '../../',
    //     jsonPath = rootPath + 'data-config/',
        let config = {
            handleMessage: _.noop,//cfg.rollbarToken ? rollbar.handleErrorWithPayloadData : _.noop,
            DATETIME_FORMAT: 'YYYYMMDDHHmm',
            Promise: Promise,
            moment: require('moment'),
            validator: require('validator'),
            // Error: require(utilsPath + 'err')(),
            // ErrorCodes: require(utilsPath + 'error-codes'),
            //  dbStructure: require(jsonPath + 'dbstructure.json'),
            // mandatoryFields: require(jsonPath + 'mandatory-fields.json'),
            // relationships: require(jsonPath + 'db-relationships.json'),
            // reachables: require(jsonPath + 'db-reachables.json'),
            // entityAccess: require(jsonPath + 'entity-access.json'),
            // fieldsConfig: require(jsonPath + 'db-duplicate-fields.json'),
            // mappingConfig: require(jsonPath + 'mapping-config.json'),
            // appPrefs: require(jsonPath + 'app-preferences.json')
        };
    // config.cacheProvider = require(utilsPath + 'cache-provider')(cfg.redis, logger);
    // config.dbCols = require(utilsPath + 'camelize-table-fields')()(config.dbStructure.tables);
    // config = _.merge(config, require('./camelize-db-fields')(config, _)(config.dbStructure));
    return Promise.resolve(config);
    return config.cacheProvider.get('config:' + process.env.NODE_ENV, {}).then((env) => {
        // logger.debug('Loaded Configuration : ', env);
        config = _.merge(config, env || {});
        // logger.debug('Final Configuration : ', config);
        return Promise.resolve(config);
    });
};
