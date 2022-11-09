module.exports = app => {
    const actionCtrl = require('../controllers/peakSeasons.controller');
    const commonCtrl = require(`../controllers/commonCtrl.controller`);
  
    var router = require("express").Router();
    
    router.post('/', commonCtrl.saveData);

    router.get('/', commonCtrl.findAllWithPaging);

    router.get('/:id', commonCtrl.getEntityById);
  
     app.use('/booking_be/peakseasons', router);
  };