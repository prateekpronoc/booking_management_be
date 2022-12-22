module.exports = app => {
    const commonCtrl = require(`../../controllers/commonCtrl.controller`);
    // const swappingLogicCtrl = require(`../../controllers/bookingSwapping.controller`);
    // console.log('fadsfasdfsaadsfdsafsdfasdfsfssaasdfsadf');
    var router = require("express").Router();
    
    router.post('/', commonCtrl.saveData);

    router.get('/', commonCtrl.findAllWithPaging);

    router.get('/:id', commonCtrl.getEntityById);
  
     app.use('/booking_be/userauditlogs', router);
  };