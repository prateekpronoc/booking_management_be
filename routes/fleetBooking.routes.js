module.exports = app => {
    const fleetBookingCtrl = require('../controllers/fleetBooking.controller.js');
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", fleetBookingCtrl.create);
  
    // Retrieve all Tutorials
    router.get("/", fleetBookingCtrl.findAll);

    router.get("/:id", fleetBookingCtrl.findOne);
  
    // // // Retrieve all published Tutorials
    // // router.get("/published", tutorials.findAllPublished);
  
    // // // Retrieve a single Tutorial with id
    // router.get("/:name", customer.findOneByName);
    
  
    // // Update a Tutorial with id
    // router.put("/:id", tutorials.update);
  
    // // Delete a Tutorial with id
    // router.delete("/:id", tutorials.delete);
  
    // // Delete all Tutorials
    // router.delete("/", tutorials.deleteAll);
  
     app.use('/booking_be/fleetbooking', router);
  };