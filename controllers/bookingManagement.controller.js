const db = require("../models");
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../models");
// const {moment} = require('moment');
// var _ = require('lodash');

var _ = require('../startup/load-lodash')();
var Promise = require('bluebird');
var moment = require('moment');
// console.log(db.customer);
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.availabilitySearch = (req, res) => {
    var returnObj = {},
        peakdayList;
    var packageVehicles;
    let cancelStatus = 'cancelled';
    let completedStatus = 'bookingCompleted';
    let fleetCancelStatus = 'cancelled';
    let fleetBookingCompleted = 'tripCompleted';
    let queryStr = 'SELECT b.vehicle_id AS vehicleId, COUNT(b.id) AS count FROM temp_bookings AS b WHERE (b.booking_status not in (:cancelStatus,:completedStatus,:fleetCancelStatus,:fleetBookingCompleted)) and ((b.start_date >= :from AND b.start_date <= :to) OR (b.end_date >= :from AND b.end_date <= :to) or (:from between b.start_date and b.end_date) or (:to between b.start_date and b.end_date) or (b.end_date between :from and :to) or (b.start_date between :from and :to)) group by b.vehicle_id';
    let dt = {
        from: req.body.startDate,
        to: req.body.endDate,
        cancelStatus: cancelStatus,
        completedStatus: completedStatus,
        fleetCancelStatus: fleetCancelStatus,
        fleetBookingCompleted: fleetBookingCompleted
    };
    var busyOnes = [];
    doStuff(queryStr, dt).then((resp) => {
        busyOnes = _.map(resp, 'vehicleId');
        return (db.vehicles).findAndCountAll();
    }).then((response) => {
        var availableVehicles = _.difference(_.map(response.rows, 'id'), busyOnes);
        var filteredVehicles = _.filter(response.rows, (val) => {
            if (_.indexOf(availableVehicles, val.id) > -1) {
                return val;
            }
        });
        return res.status(200).json(filteredVehicles);
    });
    //   res.status(200).json('YOu hit the righ API');
};


async function doStuff(queryString, dt) {
    try {
        const msg = await sequelize.query(
            queryString,
            {
                replacements: dt,
                type: QueryTypes.SELECT
            }
        );
        // console.log(msg)
        return msg;
    } catch (error) {
        console.error(error)
    }
    console.log("Outside")
}


exports.rentcalculator = (req,res)=>{
     (db.rentalPackage).findAll({
        where: {
            vehiclegroup_id: {
                [Op.in]: req.body.groupIds
            }
        }
    }).then((resp)=>{
        res.status(200).json(resp);
    })
    
}