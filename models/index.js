const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
//   operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    // acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.customer = require('./customer.model.js')(sequelize, Sequelize);
db.dailRentalInquiry = require(`./dailyRentalInquiry.model.js`)(sequelize,Sequelize);
db.vehicles = require(`./vehicle.model.js`)(sequelize,Sequelize);
db.rentalPackage = require(`./rentalPackage.model.js`)(sequelize,Sequelize);
db.fleetBookingSeq = require(`./fleetBookingSeq.model.js`)(sequelize,Sequelize);
db.fleetBooking = require(`./fleetBookings.model.js`)(sequelize,Sequelize);
db.bookingPayments = require(`./bookingPayments.model.js`)(sequelize,Sequelize);
db.bookingTripStartInfo = require(`./bookingTripStartInfo.model`)(sequelize,Sequelize);
db.bookingTripEndInfo = require(`./bookingTripEndInfo.model`)(sequelize,Sequelize);
db.bookingLineItem = require(`./bookingLineItems.model`)(sequelize,Sequelize);
db.bookingSeq = require(`./bookingSeq.model`)(sequelize,Sequelize);
module.exports = db;