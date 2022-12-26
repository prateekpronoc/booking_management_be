
'use strict';
var requireDir = require('require-dir');
module.exports = function(config, _) {
    return function(folderName, handleRoute) {
        return config.Promise.resolve(loadFilesRecursive(requireDir(folderName, {
            recurse: true
        }), {}, '', handleRoute));
    };

    function loadFilesRecursive(routes, routeDef, prefix, handleRoute) {
        return _.transform(routes, (result, module, key) => {
            console.log('Key: ' + key + ' Module = ' + module);
            if (_.isFunction(module)) {
                result[_.camelCase(prefix + '_' + key)] = handleRoute(_, module, key);
                return result;
            } else {
                return loadFilesRecursive(module, result, prefix + '_' + key, handleRoute);
            }
        }, routeDef);
    }
};