module.exports = app => {
    
    const actionCtrl = require('../../auth/controllers/auth.controller');
    // const actionCtrl = require(`../controllers/auth.controller`);
  
  
    var router = require("express").Router();
    
    router.post('/auth', actionCtrl.userAuth);
  
     app.use('/booking_be/users', router);
  };