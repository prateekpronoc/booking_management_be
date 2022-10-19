const db = require("../models");
const { database } = require('sequelize');
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../models");
var _ = require('lodash');
// console.log(db.customer);
// const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {

};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const limit = req.query.pageSize ? +(req.query.pageSize) : 10;
    // const offset = const limit = size ? +size : 3;
    const offset = req.query.page ? req.query.page * limit : 0;


    (db.dailRentalInquiry).findAndCountAll({ limit, offset })
        .then(data => {
            const returnObj = {
                count: data.count,
                next: offset + 1,
                previous: offset - 1,
                results: data.rows
            };
            res.status(200).json(returnObj);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {

};

exports.searchAll = (req, res) => {

    var returnObj = {},
        peakdayList;
    var packageVehicles;
    let cancelStatus = 'cancelled';
    let completedStatus = 'bookingCompleted';
    let fleetCancelStatus = 'cancelled';
    let fleetBookingCompleted = 'tripCompleted';
    console.log(req.body);
    // res.status(200).json({ id: 1 }); 
    let queryStr = 'SELECT b.vehicle_id AS vehicleId, COUNT(b.id) AS count FROM temp_bookings AS b WHERE (b.booking_status not in (:cancelStatus,:completedStatus,:fleetCancelStatus,:fleetBookingCompleted)) and ((b.start_date >= :from AND b.start_date <= :to) OR (b.end_date >= :from AND b.end_date <= :to) or (:from between b.start_date and b.end_date) or (:to between b.start_date and b.end_date) or (b.end_date between :from and :to) or (b.start_date between :from and :to)) group by b.vehicle_id';
    // let queryStr = 'select id as vehicleId from customers';
    let dt = {
        from: req.body.startDate,
        to: req.body.endDate,
        cancelStatus: cancelStatus,
        completedStatus: completedStatus,
        fleetCancelStatus: fleetCancelStatus,
        fleetBookingCompleted: fleetBookingCompleted
    };

    // console.log(sequelize.query,dt)
    var busyOnes = [];
    doStuff(queryStr,dt).then((resp)=>{
        busyOnes = _.map(resp, 'vehicleId');
        // res.status(200).json(busyOnes); 

        return  (db.vehicles).findAndCountAll();
    }).then((response)=>{
        var availableVehicles = _.difference(_.map(response.rows, 'id'), busyOnes);
        var filteredVehicles = _.filter(response.rows, (val) => {
            if (_.indexOf(availableVehicles, val.id) > -1) {
                return val;
            }
        });
        response.rows = filteredVehicles;
        
        res.status(200).json(response.rows); 
    })
    // sequelize.query(
    //     'SELECT * FROM projects WHERE status = ?',
    //     {
    //       replacements: ['active'],
    //       type: QueryTypes.SELECT
    //     }
    //   );

    // return database.query(queryStr, {
    //     // replacements: dt,
    //     type: QueryTypes.SELECT
    // }).then(()=>{
    //     res.status(200).json({ id: 1 });    
    // });
    // res.status(200).json({ id: 1 });
}



async function doStuff(queryString,dt) {
  try {
    const msg = await sequelize.query(
        queryString,
        {
           replacements: dt,
          type: QueryTypes.SELECT
        }
      );
    console.log(msg)
    return msg;
  } catch (error) {
    console.error(error)
  }
  console.log("Outside")
}