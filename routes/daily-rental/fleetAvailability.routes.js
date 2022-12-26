module.exports = app => {
    var router = require("express").Router();
    const actionCtrl = require('../../controllers/daily-rental/fleetAvailability.controller')
    console.log('fsadfasdfsd');
    router.post('/search', actionCtrl.searchAvailability);
    
    app.use('/daily_rental/dailyfleet', router);
};