module.exports = app => {
    const commonCtrl = require(`../../controllers/commonCtrl.controller`);
   const blockVehicleCtrl = require(`../../controllers/block-vehicles/blockVehicles.controller`);
    var router = require("express").Router();
    
    router.post('/', blockVehicleCtrl.saveData);

    router.get('/', commonCtrl.findAllWithPaging);

    router.get('/:id', commonCtrl.getEntityById);
  
     app.use('/booking_be/blockedvehicles', router);
  };