module.exports = app => {
    const dailyRentalInquiry = require('../controllers/dailRentalInquiry.controller.js')
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    // router.post("/", tutorials.create);
  
    // Retrieve all Tutorials
    router.post("/", dailyRentalInquiry.searchAll);

    router.post("/rentalpackage", dailyRentalInquiry.fetchAllRentalPackages);

    router.post('/rentaldetails',dailyRentalInquiry.fetchRentalDetails);
  
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
  
     app.use('/booking_be/api/vch/v1/s/dailyRentalInquiry', router);
  };