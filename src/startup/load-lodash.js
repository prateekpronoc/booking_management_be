'use strict';

var _ = require('lodash');
module.exports = function() {
    _.mixin({
        trimObject: trimObject,
        camelizeObject: camelizeObjects,
        toLowerCase: toLowerCase,
        indexify: indexify,
        indexifyArray: indexifyArray,
        mergeChildrenToParent: mergeChildrenToParent,
        objectDifference: objectDifference,
        jsonToArray: jsonToArray,
        equal: equal,
        groupAndIndex: groupAndIndex,
        indexArray: index,
        transformKeys: transformKeys,
        snakifyObjects: snakifyObjects,
        transformObject: transformObject,
        isIdAttribute: isIdAttribute,
        processIdAttribute: processIdAttribute,
        isTemporal: isTemporal
    });
    return _;

    function groupAndIndex(array, masterKeyAttr, idAttr, valueAttr) {
        if (!array || array.length === 0 || !masterKeyAttr || !idAttr || !valueAttr) {
            return {};
        }
        return _.reduce(array, function(res, val) {
            ((res[val[masterKeyAttr]] || (res[val[masterKeyAttr]] = {}))[val[idAttr]] || ((res[val[masterKeyAttr]] ||
                (res[val[masterKeyAttr]] = {}))[val[idAttr]] = [])).push(valueAttr ? val[valueAttr] : val);
            return res;
        }, {});
    }

    function equal(object1, object2, attributes) {
        var attrs = attributes && attributes.length > 0 ? attributes : _.keys(object1);
        return _.isMatch(_.pick(object1, attrs), _.pick(object2, attrs));
    }

    function trimObject(entity, isDeep) {
        if (isDeep === undefined) {
            isDeep = true;
        }
        return _.transform(entity, function(result, value, key) {
            if (isDeep && (_.isObject(value) || _.isArray(value)) && _.size(value) > 0) {
                result[_.camelCase(key)] = trimObject(value, isDeep);
            } else {
                result[_.camelCase(key)] = value && _.isString(value) ? value.trim() : value;
            }
        });
    }

    function objectDifference(object1, object2, keys) {
        if (!object1 || _.size(object1) === 0) {
            return {};
        }
        if (!object2 || _.size(object2) === 0) {
            return object1;
        }
        if (!_.isObject(object1) || !_.isObject(object2)) {
            return object1;
        }
        if (!keys) {
            keys = _.keys(object1);
        }
        var obj = {};
        _.forOwn(_.pick(object1, keys), function(value, key) {
            if ((object2[key] === undefined && value !== undefined) || (object2[key] === null && value !== null) || object2[key] !== value) {
                obj[key] = value;
            }
        });
        return obj;
    }

    function toLowerCase(data) {
        return _.transform(data, function(result, value, key) {
            result[_.camelCase(key)] = value ? value.toLowerCase() : value;
        });
    }

    function transformKeys(data, isDeep, apply) {
        if (isDeep === undefined) {
            isDeep = true;
        }
        return _.transform(data, function(result, value, key) {
            if (isDeep && (_.isObject(value) || _.isArray(value)) && _.size(value) > 0) {
                result[apply(key)] = transformKeys(value, isDeep, apply);
            } else {
                result[apply(key)] = value;
            }
        });
    }

    function transformObject(data, isDeep, keyApply, valueApply) {
        if (isDeep === undefined) {
            isDeep = true;
        }
        return _.transform(data, function(result, value, key) {
            if (isDeep && (_.isObject(value) || _.isArray(value)) && _.size(value) > 0) {
                result[keyApply ? keyApply(key) : key] = transformObject(value, isDeep, keyApply, valueApply);
            } else {
                result[keyApply ? keyApply(key) : key] = valueApply ? valueApply(key, value) : value;
            }
        });
    }

    function isIdAttribute(fieldName) {
        return fieldName && _.isString(fieldName) && fieldName.indexOf('Id') === (fieldName.length - 2) || fieldName === 'id';
    }

    function processIdAttribute(fieldName, fieldValue) {
        return isIdAttribute(fieldName) && fieldValue ? +fieldValue : fieldValue;
    }

    function camelizeObjects(data, isDeep) {
        return transformKeys(data, isDeep, _.camelCase);
    }

    function snakifyObjects(data, isDeep) {
        return transformKeys(data, isDeep, _.snakeCase);
    }

    function indexify(data, attr, valueAttribute) {
        return _.reduce(data, function(res, value) {
            if (res[value[attr]] && !_.isArray(res[value[attr]])) {
                var tmp = res[value[attr]];
                res[value[attr]] = [];
                res[value[attr]].push(tmp);
                res[value[attr]].push(valueAttribute ? value[valueAttribute] : value);
            } else if (!_.has(res, value[attr])) {
                res[value[attr]] = valueAttribute ? value[valueAttribute] : value;
            } else {
                res[value[attr]].push(valueAttribute ? value[valueAttribute] : value);
            }
            return res;
        }, {});
        // return _.zipObject(_.map(data, attr), _.map(data, valueAttribute));
    }

    function index(data, attr, valueAttribute) {
        return _.reduce(data, function(res, value) {
            (res[value[attr]] || (res[value[attr]] = [])).push(valueAttribute ? value[valueAttribute] : value);
            return res;
        }, {});
    }

    function indexifyArray(data, attr) {
        return _.zipObject(_.map(data, attr), data);
    }

    function mergeChildrenToParent(parentArray, childrenObj, attr) {
        if (!attr || !parentArray || !childrenObj || _.size(parentArray) === 0) {
            return parentArray;
        }
        return _.transform(parentArray, function(result, value, key) {
            if (childrenObj[value[attr]]) {
                value.children = childrenObj[value[attr]];
                result[key] = value;
            }
        });
    }

    function jsonToArray(object) {
        if (!object || _.size(object) === 0) {
            return [];
        }
        let arr = [],
            ob = {};
        _.forOwn(object, function(value, key) {
            ob[key] = value;
            arr.push(ob);
            ob = {};
        });
        return arr;
    }

    function isTemporal(type) {
        return type === 'time' || type === 'date' || type === 'datetime';
    }
};
