module.exports = app => {
    const actionCtrl = require('../controllers/bookingModificaiton.controller');
  
    var router = require("express").Router();
    
    router.post('/extrequestrental', actionCtrl.extensionRequestRentalDetails);
   
    // router.post('/savebookingextension', actionCtrl.extensionRequestRentalDetails);
    // savebookingextension
  
     app.use('/booking_be/bookingmodification', router);
  };