module.exports = app => {
    const actionCtrl = require('../controllers/bookingExtension.controller');
  
    var router = require("express").Router();
    
    router.post('/', actionCtrl.saveData);
   
    // router.post('/savebookingextension', actionCtrl.extensionRequestRentalDetails);
    // savebookingextension
  
     app.use('/booking_be/bookingextension', router);
  };