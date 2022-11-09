module.exports = app => {
    const actionCtrl = require('../controllers/commonCtrl.controller')
  
    var router = require("express").Router();
    
    router.post('/:key', actionCtrl.saveData);

    router.get('/:key/limit/:limit/offset/:offset', actionCtrl.findAllWithPaging)
  
     app.use('/booking_be/userattendance', router);
  };