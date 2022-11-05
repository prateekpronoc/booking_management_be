const db = require("../models");
var _ = require('../startup/load-lodash')();
var moment = require('moment');
const { getIdParam } = require('./helper');
const Op = db.Sequelize.Op;
const crypto = require('crypto');


async function saveData(req, res) {
    // return res.status(200).send(req.body);
    console.log(req.body);
    await (db.sequelize).transaction(async function (transactional) {

        const extensionDatails = await (db.bookingExtension).create(req.body, { transaction: transactional });

        const bookingUpdateObject = req.body.bookingObject;
        // bookingUpdateObject.endDate = req.body.endDate;

        const bookingData = await (db.fleetBooking).update(bookingUpdateObject,
            {
                where: {
                    id: req.body.bookingId
                }
            }, { transaction: transactional });

        const paymentData = await (db.bookingPayments).create(req.body.paymentObject, { transaction: transactional })

        // TODO: Update Vehicle Odometer Reading.....

        return res.status(200).send(extensionDatails);
    });
}



async function findByBookingId(req, res) {
    let whereCondition = { bookingId: req.params.bookingId };
    const dataSet = await (db.bookingExtension).findAll({ where: whereCondition }).catch(error => {
        return res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving data."
        });
    });
    res.status(200).json({ msg: 'success', data: dataSet != null ? dataSet : {} });
}

async function findAll(req, res) {
    const limit = req.query.pageSize ? +(req.query.pageSize) : 10;
    // const offset = const limit = size ? +size : 3;
    const offset = req.query.page ? req.query.page * limit : 0;
    const data = await (db.bookingExtension).findAndCountAll({ limit, offset , order: [
        // Will escape title and validate DESC against a list of valid direction parameters
        ['createdOn', 'DESC']]}).catch(error => {
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
    saveData,
    findByBookingId,
    findAll
}










