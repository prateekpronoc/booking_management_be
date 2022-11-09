module.exports = app => {
    const actionCtrl = require('../controllers/documents.controller');
  
    var router = require("express").Router();
    
    router.post('/', actionCtrl.saveData);
   
    router.get('/resourceId/:resourceId/resourceType/:resourceType', actionCtrl.fetchAllResourceType);

    router.get('/', actionCtrl.test);
    // router.post('/savebookingextension', actionCtrl.extensionRequestRentalDetails);
    // savebookingextension
  
     app.use('/booking_be/documents', router);
  };