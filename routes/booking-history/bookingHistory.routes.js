module.exports = app => {
    const commonCtrl = require(`../../controllers/commonCtrl.controller`);
   
    var router = require("express").Router();

    router.get('/', commonCtrl.findAllWithPaging);
  
     app.use('/booking_be/bookinghistory', router);
  };