'use strict';
var sequelize = require('sequelize');
var Promise = require('bluebird');
const { Op } = require("sequelize");

module.exports = function(config, _) {
  return function(database, data, entityName, columns) {
    var query = {
      limit: data.limit ? parseInt(data.limit) : config.queryLimit ? config.queryLimit : 20,
      offset: data.offset ? parseInt(data.offset) : 0,
      order: data.order ? [data.order] : ['id', 'DESC']
    };
    var exCols = _.intersection(_.keys(data), columns);
    var whereConditions = _.pick(data, exCols);
    // console.log(whereConditions);
    // if (_.has(data, 'isArchived')) {
    //     whereConditions.isArchived = data.isArchived;
    // } else {
    //     whereConditions.isArchived = false;
    // }
    // var keys = ['users', 'documents', 'vehicles','revenueBookings'];
    // if (_.indexOf(keys, data.key) > -1) {
    //   if (_.has(data, 'isArchived')) {
    //     whereConditions.isArchived = data.isArchived;
    //   } else {
    //     whereConditions.isArchived = false;
    //   }
    // }

    let allAttributes = (database[entityName]).rawAttributes;
    
    if (_.size(whereConditions) > 0) {
      query.where = _.transform(whereConditions, (result, condition, key) => {
        var parsed = condition;
        try {
            // console.log();   
            // console.log((data[key])[key]);
            // console.log(allAttributes[data.key]);
        //   var type = config.tableFieldMappings[data.key][key];
        var type = _.isObject(allAttributes[key]['type']) ? (allAttributes[key]['type']).key : allAttributes[key]['type'];
        if(type=='INTEGER'){
            // result[key] = {};
            // console.log(result[key]);
            // console.log(data);
            // console.log(whereConditions[key]);
        }
          if (_.isArray(parsed)) {
            result[key] = {};
            if (data[key + 'Not']) {
              result[key].$notIn = parsed;
            } else {
              result[key].$in = parsed;
            }
          } else if (data[key + 'Not']) {
            result[key] = {
              $ne: condition
            };
          } else if (data[key + 'Like']) {
            result[key] = {
              $like: '%' + condition + '%'
            };
          } else if (data[key + 'Gt']) {
            result[key] = {
              $gt: _.isTemporal(type) ? config.services.commonStringToDate(data.key, key, condition)[key] : condition
            };
          } else if (data[key + 'Lt']) {
            result[key] = {
              $lt: _.isTemporal(type) ? config.services.commonStringToDate(data.key, key, condition)[key] : condition
            };
          } else if (data[key + 'Ci']) {
            console.log('test123');
            result[key] = sequelize.where(sequelize.fn('lower', sequelize.col(key)), sequelize.fn('lower', condition));
          } else if(type=='INTEGER'){
            // [Op.eq]
            // result[key] = {
            //     [Op.eq]: parseInt(condition)  //condition
            //   };
             result[key] = parseInt(condition);  
             console.log(result);
          }else{
            // console.log(_.isTemporal(type));
            
            result[key] = _.isTemporal(type) ? config.services.commonStringToDate(data.key, key, condition)[key] : condition;
          }
        } catch (err) {
          throw err;
        }
        return result;
      }, {});
    }
    if (data.attributes) {
    //   config.logger.info('Data Attributes: ', {
    //     attrs: data.attributes,
    //     columns: columns
    //   });
      data.attributes = _.flatten([data.attributes]);
      query.attributes = _.intersection(columns, data.attributes);
    }
    // console.log(query);
    return Promise.resolve(query);
  };
};
