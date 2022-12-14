module.exports = app => {
    const bookingPaymentCtrl = require('../controllers/bookingPayment.controller');
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", bookingPaymentCtrl.create);
  
    // Retrieve all Tutorials
    router.get("/", bookingPaymentCtrl.findAll);

    // router.get("/:id", fleetBookingCtrl.findOne);
  
    // // // // Retrieve all published Tutorials
    // router.get("/published", tutorials.findAllPublished);
  
    // // // // Retrieve a single Tutorial with id
    // // router.get("/:name", customer.findOneByName);
    
  
    // // // Update a Tutorial with id
    // router.post("/update", fleetBookingCtrl.update);
  
    // // Delete a Tutorial with id
    // router.delete("/:id", tutorials.delete);
  
    // // Delete all Tutorials
    // router.delete("/", tutorials.deleteAll);
  
     app.use('/booking_be/booking-payments', router);
  };