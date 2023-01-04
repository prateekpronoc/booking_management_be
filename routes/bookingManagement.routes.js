module.exports = app => {
    const bookingManagementCtrl = require('../controllers/bookingManagement.controller.js');
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    // router.post("/", tutorials.create);
  
    // Retrieve all Tutorials
    router.post("/availabilitysearch", bookingManagementCtrl.availabilitySearch);

    router.post("/rentaldetails", bookingManagementCtrl.rentcalculator);

     // router.get("/:id", tutorials.findOne);
  
    // // Retrieve all published Tutorials
    // router.get("/published", tutorials.findAllPublished);
  
    // // Retrieve a single Tutorial with id
    // router.get("/:id", tutorials.findOne);
  
    // // Update a Tutorial with id
    // router.put("/:id", tutorials.update);
  
    // // Delete a Tutorial with id
    // router.delete("/:id", tutorials.delete);
  
    // // Delete all Tutorials
    // router.delete("/", tutorials.deleteAll);

    router.post('/closeinquiry', bookingManagementCtrl.closeInquiry)
  
     app.use('/booking_be/', router);
  };