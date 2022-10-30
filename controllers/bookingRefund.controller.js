const db = require("../models");
var _ = require('../startup/load-lodash')();
var moment = require('moment');
const { getIdParam } = require('./helper');
const Op = db.Sequelize.Op;
const crypto = require('crypto');


async function initiateRefund(req, res) {
  await (db.sequelize).transaction(async function (transactional) {

    const bookingRefund = await (db.bookingRefund).create(req.body, { transaction: transactional });

    const bookingUpdateObject = { 
      status : 'Refund Initiated',
      refundableAmount : req.body.refundableAmount
    };
   
    const bookingData = await (db.fleetBooking).update(bookingUpdateObject,
      {
        where: {
          id: req.body.bookingId
        }
      }, { transaction: transactional });


    // TODO: Update Vehicle Odometer Reading.....

    return res.status(200).send(bookingRefund);
  });
}

async function updateData(req, res) {
  await (db.sequelize).transaction(async function (transactional) {

    const startTripDetails = await (db.bookingTripEndInfo).update(req.body, {
      where: {
        id: req.body.id
      }
    }, { transaction: transactional });

    const bookingUpdateObject = { 
      finalOdometer: req.body.odometerReading,
      extraKmCharges:req.body.extraHrCharges,
      extraHrCharges : req.body.extraHrCharges,
      totalRent : req.body.totalRent
    };

   

    const bookingData = await (db.fleetBooking).update(bookingUpdateObject,
      {
        where: {
          id: req.body.bookingId
        }
      }, { transaction: transactional });


    // TODO: Update Vehicle Odometer Reading.....

    res.status(200).json({
      msg: "Data was updated successfully.",
      data: req.body
    });
  });
}

async function findAllWithCount(req, res) {
    const limit = req.query.pageSize ? +(req.query.pageSize) : 10;
    // const offset = const limit = size ? +size : 3;
    const offset = req.query.page ? req.query.page * limit : 0;
  const data = await (db.bookingRefund).findAndCountAll({ limit, offset }).catch(error => {
    return res.status(500).send({
      message:
      error.message || "Some error occurred while retrieving data."
    });
  });
  const returnObj = {
    count: data.count,
    next: offset + 1,
    previous: offset - 1,
    results: data.rows
};
res.status(200).json(returnObj); 
}

module.exports = {
initiateRefund,
  findAllWithCount
}











