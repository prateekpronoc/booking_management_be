module.exports = app => {
    const inquiryCtrl = require('../controllers/inquiry.controller');
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", inquiryCtrl.saveInquiry);

    router.get('/:customerId', inquiryCtrl.fetchBookingByCustomerId);
  
  
     app.use('/booking_be/booking-inquiry', router);

  };