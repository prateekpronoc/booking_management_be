module.exports = app => {
    const commonCtrl = require(`../../controllers/commonCtrl.controller`);
    // const swappingLogicCtrl = require(`../../controllers/bookingSwapping.controller`);
    // console.log('fadsfasdfsaadsfdsafsdfasdfsfssaasdfsadf');
    var router = require("express").Router();
    
    router.post('/', commonCtrl.saveData);

    router.get('/', commonCtrl.findAllWithPaging);

    router.get('/:id', commonCtrl.getEntityById);

    router.post('/places',commonCtrl.getPlaces);
  
     app.use('/booking_be/deliverylocations', router);
  };