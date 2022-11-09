module.exports = (baseUrl, config) => {
    return async () => {
        var pathArray = baseUrl.split('/');
        var key = pathArray[2];
        return config.modelKeys[key];
    }
}