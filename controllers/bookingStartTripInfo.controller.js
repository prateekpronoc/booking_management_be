const db = require("../models");
var _ = require('../startup/load-lodash')();
var moment = require('moment');
const { getIdParam } = require('./helper');
const Op = db.Sequelize.Op;
const crypto = require('crypto');



async function saveData(req, res) {
  await (db.sequelize).transaction(async function (transactional) {

    const startTripDetails = await (db.bookingTripStartInfo).create(req.body, { transaction: transactional });
    const bookingUpdateObject = { initialOdometer: req.body.odometerReading };
    if (_.has(req.body, 'changeStatus') && req.body.changeStatus) {
      bookingUpdateObject.status = 'Enroute';
    }
    const bookingData = await (db.fleetBooking).update(bookingUpdateObject,
      {
        where: {
          id: req.body.bookingId
        }
      }, { transaction: transactional });


    // TODO: Update Vehicle Odometer Reading.....

    return res.status(200).send(startTripDetails);
  });
}

async function updateData(req, res) {
  await (db.sequelize).transaction(async function (transactional) {

    const startTripDetails = await (db.bookingTripStartInfo).update(req.body, {
      where: {
        id: req.body.id
      }
    }, { transaction: transactional });

    const bookingUpdateObject = { initialOdometer: req.body.odometerReading };

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

async function findOneByBookingId(req, res) {
  let bookingId = req.params.bookingId;
  let whereCondition = { bookingId: req.params.bookingId }
  const dataSet = await (db.bookingTripStartInfo).findOne({ where: whereCondition }).catch(error => {
    return res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving data."
    });
  });
  res.status(200).json({ msg: 'success', data: dataSet != null ? dataSet : {} });
}

module.exports = {
  saveData,
  findOneByBookingId,
  updateData
}





