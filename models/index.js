const dbConfig = require("../config/db.config.js");
const requireDir = require('require-dir');
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
  },
  logging: false,
  timezone: '+05:30'
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
db.bookingRefund = require(`./bookingRefund.model`)(sequelize,Sequelize);
db.bookingExtension = require(`./bookingExtensions.model`)(sequelize,Sequelize);
db.cancellationPolicies = require(`./cancellationPolicies.model`)(sequelize,Sequelize);
db.cancelledBookings =require(`./cancelledBookings.model`)(sequelize,Sequelize);
db.bookingReschedules = require(`./bookingReschedule.model`)(sequelize,Sequelize);
db.documents = require(`./documents.model`)(sequelize,Sequelize);
db.peakSeasonsRental = require(`./peakSeasons.model`)(sequelize,Sequelize);
db.userAttendance = require(`./userAttendance.model`)(sequelize,Sequelize);
require(`./tenants.model`)(sequelize,Sequelize,db);

require('../auth/models/users.model')(sequelize,Sequelize,db);
db.vehicleGroups = require(`./vehicle-groups/vehilceGroups.model`)(sequelize,Sequelize);
db.resourceImages = require(`./resource-images/resourceImages.model`)(sequelize,Sequelize);
db.fleetBookingSwappings = require(`./booking-swappings/bookingSwapping`)(sequelize,Sequelize);
db.deliveryLocations = require(`./delivery-locations/deliveryLocations.model`)(sequelize,Sequelize);
db.pickupLocations = require(`./pickup-locations/pickupLocations.model`)(sequelize,Sequelize);

db.hubs = require(`./hubs/hubs.model`)(sequelize,Sequelize);
db.bookingComments = require(`./booking-comments/bookingComments`)(sequelize,Sequelize);
db.tempBookings = require(`./temp-bookings/tempBookings.model`)(sequelize,Sequelize);
db.userAuditLogs = require(`./user-audit-logs/userAuditLogs.model`)(sequelize,Sequelize);
module.exports = db;