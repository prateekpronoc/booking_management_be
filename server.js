const express = require("express");
const cors = require("cors");

const app = express();

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

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Booking System." });
});

app.use(function(req, res, next){
    req.setTimeout(500000, function(){
        // call back function is called when request timed out.
    });
    next();
});

console.log('123123');

require('./routes/customer.routes')(app);
require('./routes/dailyRentalInquiry.routes')(app);
require('./routes/selfDriveBooking.routes')(app); 
require('./routes/bookingManagement.routes')(app);
require('./routes/fleetBooking.routes')(app);
// set port, listen for requests
const PORT = process.env.PORT || 9091;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});