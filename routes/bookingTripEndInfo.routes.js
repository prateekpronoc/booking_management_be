module.exports = app => {
    const bookingTripEndCtrl = require('../controllers/bookingEndTripInfo.controller');
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", bookingTripEndCtrl.create);
  
    // Retrieve all Tutorials
    router.get("/", bookingTripEndCtrl.findAll);

    // router.get("/:id", fleetBookingCtrl.findOne);

    router.get("/:bookingId", bookingTripEndCtrl.findOneByBookingId);
  
    // // // // Retrieve all published Tutorials
    // router.get("/published", tutorials.findAllPublished);
  
    // // // // Retrieve a single Tutorial with id
    // // router.get("/:name", customer.findOneByName);
    
  
    // // // Update a Tutorial with id
    router.put("/:id", bookingTripEndCtrl.update);
  
    // // Delete a Tutorial with id
    // router.delete("/:id", tutorials.delete);
  
    // // Delete all Tutorials
    // router.delete("/", tutorials.deleteAll);
  
     app.use('/booking_be/booking-end-info', router);
  };