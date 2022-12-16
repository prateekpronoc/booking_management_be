const express = require("express");
const cors = require("cors");
const config = require('config'); const app = express();

var corsOptions = {
  origin: "*"
};

const db = require("./models");
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());



// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
console.log(config);
app.use(require('express-bunyan-logger')({
  name: 'logger',
  streams :[{
    path: config.logFolder + '/' + ( '') + 'wowcarz.log',
    type: 'rotating-file',
    level: 'debug',
    period: '1d', // daily rotation
    count: 3 // keep 3 back copies
  }, {
    path: config.logFolder + '/' + ( '') + 'wowcarz-err.log',
    type: 'rotating-file',
    level: 'warn',
    period: '1d', // daily rotation
    count: 3 // keep 3 back copies
  }]
}));


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Booking System." });
});



config.modelKeys = require('./data-config/data-model.json').modelTables;
// config.crypto = crypto;

app.use(function (req, res, next) {
  req.config = config;
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
  // app.use(function(req, res, next) {
  req.log.debug('this is debug in middleware');
  //     next();
  // });
  req.log.info('.getAllEntities : Params = ', req.params);
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  } else {
    return next();
  }

  // Assign the config to the req object
  req.config = config;


  req.setTimeout(500000, function () {
    // call back function is called when request timed out.
  });
  next();
});

require('./routes/customer.routes')(app);
require('./routes/dailyRentalInquiry.routes')(app);
require('./routes/selfDriveBooking.routes')(app);
require('./routes/bookingManagement.routes')(app);
require('./routes/fleetBooking.routes')(app);
require('./routes/bookingPayment.routes')(app);
require('./routes/bookingTripStartInfo.routes')(app);
require('./routes/bookingTripEndInfo.routes')(app);
require('./routes/inquiry.routes')(app);
require('./routes/bookingLineItems.routes')(app);
require('./routes/bookingRefunds.routes')(app);
require('./routes/bookingModification.routes')(app);
require('./routes/bookingExtension.routes')(app);
require('./routes/cancellationPolicies.routes')(app);
require('./routes/cancelBookings.routes')(app);
require('./routes/bookingReschedule.routes')(app);
require('./routes/documents.routes')(app);
require('./routes/peakSeasons.routes')(app);
require('./routes/userAttendance.routes')(app);
require('./routes/tenants.routes')(app);
require('./routes/auth/auth.routes')(app);
require('./routes/users.routes')(app);
require('./routes/vehicle-groups/vehicle-groups.routes')(app);
require('./routes/resouce-images/resourceImages.routes')(app);
require('./routes/booking-swappings/booking-swappings.routes')(app);
require('./routes/delivery-locations/deliveryLocations.routes')(app);
require('./routes/pickup-locations/pickupLocations.routes')(app);
require('./routes/hubs/hubs.routes')(app);
require(`./routes/booking-comments/booking-comments.routes`)(app);
require(`./routes/vehicle-bookings/vehicle-bookings.routes`)(app);
// set port, listen for requests
const PORT = process.env.PORT || 9091;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});