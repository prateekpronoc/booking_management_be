module.exports = app => {
    const commonCtrl = require(`../../controllers/commonCtrl.controller`);
    const fleetDeliveryCtrl = require(`../../controllers/fleetDelivery.ctrl`);
   
    var router = require("express").Router();
    
    router.post('/', fleetDeliveryCtrl.saveData);

    router.get('/', commonCtrl.findAllWithPaging);

    router.get('/:id', commonCtrl.getEntityById);
  
     app.use('/booking_be/alldelivery', router);
  };