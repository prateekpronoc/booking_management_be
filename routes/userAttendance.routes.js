module.exports = app => {
    const actionCtrl = require('../controllers/commonCtrl.controller');

    var router = require("express").Router();
    
    router.post('/', actionCtrl.saveData);

    router.get('/', actionCtrl.findAllWithPaging)
  
     app.use('/booking_be/userattendance', router);
  };