const db = require("../models");
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../models");
// const {moment} = require('moment');
// var _ = require('lodash');

var _ = require('../startup/load-lodash')();
var Promise = require('bluebird');
var moment = require('moment');
// //console.log(db.customer);
const Op = db.Sequelize.Op;

async function fetchBookingByVehicleId(req, res) {
    let cancelStatus = 'cancelled',
        completedStatus = 'bookingCompleted',
        fleetCancelStatus = 'cancelled',
        fleetBookingCompleted = 'tripCompleted';
    let queryStr = 'SELECT * FROM fleet_bookings AS b WHERE (b.status not in (:cancelStatus,:completedStatus,:fleetCancelStatus,:fleetBookingCompleted)) and ((b.start_date >= :from AND b.start_date <= :to) OR (b.end_date >= :from AND b.end_date <= :to) or (:from between b.start_date and b.end_date) or (:to between b.start_date and b.end_date) or (b.end_date between :from and :to) or (b.start_date between :from and :to)) and vehicle_id=:vehicleId';
    let dt = {
        from: req.query.startDate,
        to: req.query.endDate,
        cancelStatus: cancelStatus,
        completedStatus: completedStatus,
        fleetCancelStatus: fleetCancelStatus,
        fleetBookingCompleted: fleetBookingCompleted,
        vehicleId: req.query.vehicleId
    };

    const allbookings = await sequelize.query(queryStr,{replacements: dt,type: QueryTypes.SELECT});
     res.json(allbookings);
    // try {
    //     await (db.sequelize).transaction(async function (transaction) {

    //         var date = moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate(), code;

    //         const bookingSeq = await (db.fleetBookingSeq).create({ created_on: date }, { transaction });
    //         code = 'WCBLRINQ';
    //         if (bookingSeq.id < 1000) {
    //             code = 'WCBLRINQ' + '0' + bookingSeq.id;
    //         } else {
    //             code = 'WCBLRINQ' + bookingSeq.id;
    //         }

    //         req.body.inquiryCode = code;
    //         console.log(req.body);
    //         const inquiry = await (db.fleetBooking).create(req.body, { transaction });




    //         return res.status(200).send(inquiry);
    //     });
    //     console.log('success');
    // } catch (error) {
    //     console.log(error);
    // }
}




module.exports = {
    fetchBookingByVehicleId
};





