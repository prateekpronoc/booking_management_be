
const db = require("../../models");
const { database } = require('sequelize');
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../../models");
// const {moment} = require('moment');
// var _ = require('lodash');

var _ = require('../../startup/load-lodash')();
var Promise = require('bluebird');
var moment = require('moment');
// console.log(db.customer);
// const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;


exports.searchAvailability = (req, res, next) => {
    // module.exports = function (req, res, next) {
    // console.log(req.config.Promise);
    // req.log.info('searchAvailability: Data = ', data);
    if (!req.body.startDate || !req.body.endDate) {
        return res.status(400).send('Invalid date/time range specified');
    }
    let busyOnes = [];
    console.log(req.body)
    return fetchVehicleBooked(req.body).then((resp) => {
        busyOnes = _.map(resp, 'vehicleId');
        return fetchBlockedVehicles(sequelize, req.body);
    }).then((resp) => {
        console.log(resp);
        busyOnes = _.concat(busyOnes, _.map(resp, 'vehicleId'));
        // busyOnes = _.concat(busyOnes, _.map(resp, 'vehicleId'));
        var whereCondition = { currentStatus: 'Active' ,cityId:req.body.cityId} ;
        if (busyOnes.length > 0) {
            whereCondition = _.merge(whereCondition, { id: { $notIn: [busyOnes] } });
        }
        return (db.vehicles).findAll({
            where: whereCondition,
            limit: 1000
        });
        // return fetchFleetBookingVehicles(sequelize, req.body);
    }).then((resp) => {
        return res.json(resp);
    });


};

function fetchVehicleBooked(data) {
    let cancelStatus = 'Cancelled';
    let completedStatus = 'bookingCompleted';
    let fleetCancelStatus = 'Cancelled';
    let fleetBookingCompleted = 'Trip Completed';
    let inquiry = 'Inquiry';
    let queryStr = 'SELECT b.vehicle_id AS vehicleId, COUNT(b.id) AS count FROM temp_bookings AS b WHERE (b.booking_status not in (:cancelStatus,:fleetBookingCompleted,:inquiry)) and ((b.start_date >= :from AND b.start_date <= :to) OR (b.end_date >= :from AND b.end_date <= :to) or (:from between b.start_date and b.end_date) or (:to between b.start_date and b.end_date) or (b.end_date between :from and :to) or (b.start_date between :from and :to)) group by b.vehicle_id',
        dt = {
            from: data.startDate, //_.isDate(data.from) ? data.from : data.from.toDate(),
            to: data.endDate,
            cancelStatus: cancelStatus,
            fleetBookingCompleted: fleetBookingCompleted,
            inquiry: inquiry //_.isDate(data.to) ? data.to : data.to.toDate()
        };
    // :cancelStatus,:completedStatus,:fleetCancelStatus,:fleetBookingCompleted,:inquiry
    console.log(dt);
    return sequelize.query(queryStr, {
        replacements: dt,
        type: QueryTypes.SELECT
    });

}

function fetchBlockedVehicles(database, data) {

    let blockQueryString = 'select b.vehicle_id as vehicleId,COUNT(b.id) as count FROM blocked_vehicles as b WHERE (b.is_unblocked=0) and ((b.start_date >= :from AND b.start_date <= :to) OR (b.end_date >= :from AND b.end_date <= :to) or (:from between b.start_date and b.end_date) or (:to between b.start_date and b.end_date) or (b.end_date between :from and :to) or (b.start_date between :from and :to)) group by b.vehicle_id',
        dt = {
            from: data.startDate, //_.isDate(data.from) ? data.from : data.from.toDate(),
            to: data.endDate
        };

    return database.query(blockQueryString, {
        replacements: dt,
        type: QueryTypes.SELECT
    });
}

function fetchFleetBookingVehicles(database, data) {
    let whereCondition = { cityId: req.body.cityId, currentStatus: 'Active' };
    return (database.vehicles).findAndCountAll(whereCondition);
}


