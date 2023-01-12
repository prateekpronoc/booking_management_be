module.exports = app => {
    const commonCtrl = require(`../../controllers/commonCtrl.controller`);
   
    var router = require("express").Router();

    router.get('/', commonCtrl.findAllWithPaging);
    router.post('/',commonCtrl.saveData);
  
     app.use('/booking_be/bookingconfig', router);
  };