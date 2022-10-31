module.exports = app => {
    const actionCtrl = require('../controllers/bookingRefund.controller');
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/initiateRefund", actionCtrl.initiateRefund);
  
    // Retrieve all Tutorials
    router.get("/", actionCtrl.findAllWithCount);

    // router.get("/:id", fleetBookingCtrl.findOne);
  
    // // // // Retrieve all published Tutorials
    // router.get("/:bookingId/:lineItemType", bookingLineItemsCtrl.findAllByBookingId);
  
    // // // // Retrieve a single Tutorial with id
    // // router.get("/:name", customer.findOneByName);
    
  
    // // // Update a Tutorial with id
    // router.post("/update", fleetBookingCtrl.update);
  
    // // Delete a Tutorial with id
    // router.delete("/:id", tutorials.delete);
  
    // // Delete all Tutorials
    // router.delete("/", tutorials.deleteAll);

    router.post('/approverefund', actionCtrl.approveRefunds)
  
     app.use('/booking_be/bookingrefunds', router);
  };