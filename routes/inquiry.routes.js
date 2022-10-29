module.exports = app => {
    const inquiryCtrl = require('../controllers/inquiry.controller');
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", inquiryCtrl.saveInquiry);
  
  
     app.use('/booking_be/booking-inquiry', router);
  };