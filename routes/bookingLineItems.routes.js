module.exports = app => {
    const bookingLineItemsCtrl = require('../controllers/bookingLineItems.controller');
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", bookingLineItemsCtrl.create);
  
    // Retrieve all Tutorials
    // router.get("/", bookingLineItemsCtrl.findAll);

    // router.get("/:id", fleetBookingCtrl.findOne);
  
    // // // // Retrieve all published Tutorials
    router.get("/:bookingId/:lineItemType", bookingLineItemsCtrl.findAllByBookingId);
  
    // // // // Retrieve a single Tutorial with id
    // // router.get("/:name", customer.findOneByName);
    
  
    // // // Update a Tutorial with id
    // router.post("/update", fleetBookingCtrl.update);
  
    // // Delete a Tutorial with id
    // router.delete("/:id", tutorials.delete);
  
    // // Delete all Tutorials
    // router.delete("/", tutorials.deleteAll);
  
     app.use('/booking_be/booking-line-items', router);
  };