module.exports = app => {
    const actionCtrl = require('../controllers/cancelledBookings.controller');
  
    var router = require("express").Router();
    
    router.post('/', actionCtrl.saveData);
   
    router.get(`/`, actionCtrl.fetchAll);
  
     app.use('/booking_be/cancellationbooking', router);
  };