module.exports = app => {
    const customer = require('../controllers/customer.controller.js');
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    // router.post("/", tutorials.create);
  
    // Retrieve all Tutorials
    router.get("/search", customer.searchData);
  
    // // Retrieve all published Tutorials
    // router.get("/published", tutorials.findAllPublished);
  
    // // Retrieve a single Tutorial with id
    router.get("/:name", customer.findOneByName);
    
    router.get('/name/:name',customer.searchByName);
  
    // // Update a Tutorial with id
    // router.put("/:id", tutorials.update);
  
    // // Delete a Tutorial with id
    // router.delete("/:id", tutorials.delete);
  
    // // Delete all Tutorials
    // router.delete("/", tutorials.deleteAll);
  
     app.use('/booking_be/customers', router);
  };