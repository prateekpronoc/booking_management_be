module.exports = app => {
    const bookingTripStartCtrl = require('../controllers/bookingStartTripInfo.controller');
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", bookingTripStartCtrl.saveData);
  
    // Retrieve all Tutorials
    // router.get("/", bookingTripStartCtrl.findAll);

    // router.get("/:id", fleetBookingCtrl.findOne);

    router.get("/:bookingId", bookingTripStartCtrl.findOneByBookingId);
  
    // // // // Retrieve all published Tutorials
    // router.get("/published", tutorials.findAllPublished);
  
    // // // // Retrieve a single Tutorial with id
    // // router.get("/:name", customer.findOneByName);
    
  
    // // // Update a Tutorial with id
    router.put("/:id", bookingTripStartCtrl.updateData);
  
    // // Delete a Tutorial with id
    // router.delete("/:id", tutorials.delete);
  
    // // Delete all Tutorials
    // router.delete("/", tutorials.deleteAll);
  
     app.use('/booking_be/booking-start-info', router);
  };