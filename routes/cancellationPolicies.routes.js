module.exports = app => {
    const actionCtrl = require('../controllers/cancellationPolicies.controller');
  
    var router = require("express").Router();
    
    router.post('/', actionCtrl.saveData);
   
    router.get(`/`, actionCtrl.fetchAll);
  
     app.use('/booking_be/cancellationpolicies', router);
  };