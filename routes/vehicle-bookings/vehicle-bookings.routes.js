module.exports = app => {
    const actionCtrl = require('../../controllers/vehicleBookings.ctrl');

    var router = require("express").Router();
    

    router.get('/getallbyvehicle', actionCtrl.fetchBookingByVehicleId);

  
     app.use('/booking_be/vehiclebookings', router);
  };