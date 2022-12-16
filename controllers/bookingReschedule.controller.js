const db = require("../models");
var _ = require('../startup/load-lodash')();
var moment = require('moment');
const { getIdParam } = require('./helper');
const Op = db.Sequelize.Op;
const crypto = require('crypto');


async function saveData(req, res) {

    await (db.sequelize).transaction(async function (transactional) {

        const reschduleDetails = await (db.bookingReschedules).create(req.body, { transaction: transactional });

        const bookingUpdateObject = req.body.bookingObject;
        // bookingUpdateObject.endDate = req.body.endDate;

        const bookingData = await (db.fleetBooking).update(bookingUpdateObject,
            {
                where: {
                    id: req.body.bookingId
                }
            }, { transaction: transactional });

        if (_.has(req.body, 'paymentObject')) {

            const paymentData = await (db.bookingPayments).create(req.body.paymentObject, { transaction: transactional })
        }

        // TODO: Update Vehicle Odometer Reading.....

        return res.status(200).send(reschduleDetails);
    });
}



async function findOneByBookingId(req, res) {
    let bookingId = req.params.bookingId;
    let whereCondition = { bookingId: req.params.bookingId }
    const dataSet = await (db.bookingReschedules).findOne({ where: whereCondition }).catch(error => {
        return res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving data."
        });
    });
    res.status(200).json({ msg: 'success', data: dataSet != null ? dataSet : {} });
}

async function findByBookingId(req, res) {
    let whereCondition = { bookingId: req.params.bookingId };
    const dataSet = await (db.bookingReschedules).findAll({ where: whereCondition }).catch(error => {
        return res.status(500).send({
            // conso.log()
            message:
                error.message || "Some error occurred while retrieving data."
        });
    });
    res.status(200).json({ msg: 'success', data: dataSet != null ? dataSet : {} });
}


module.exports = {
    saveData,
    findOneByBookingId,
    findByBookingId
}











