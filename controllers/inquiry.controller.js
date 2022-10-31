const db = require("../models");
var _ = require('../startup/load-lodash')();
var moment = require('moment');
const { getIdParam } = require('./helper');
const Op = db.Sequelize.Op;
const crypto = require('crypto');
const { sequelize } = require('sequelize');


async function saveInquiry(req, res) {
    try {
        await (db.sequelize).transaction(async function (transaction) {

            var date = moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate(), code;

            const bookingSeq = await (db.fleetBookingSeq).create({ created_on: date }, { transaction });
            code = 'WCBLRINQ';
            if (bookingSeq.id < 1000) {
                code = 'WCBLRINQ' + '0' + bookingSeq.id;
            } else {
                code = 'WCBLRINQ' + bookingSeq.id;
            }

            req.body.inquiryCode = code;
            console.log(req.body);
            const inquiry = await (db.fleetBooking).create(req.body, { transaction });




            return res.status(200).send(inquiry);
        });
        console.log('success');
    } catch (error) {
        console.log(error);
    }
}

async function fetchBookingByCustomerId(req, res) {
    const limit = req.query.pageSize ? +(req.query.pageSize) : 10;
    // const offset = const limit = size ? +size : 3;
    const offset = req.query.page ? req.query.page * limit : 0;
    const data = await (db.fleetBooking).findAndCountAll({  where: {
        customerId :req.params.customerId
      } }).catch(error => {
        return res.status(500).send({
            message:
                error.message || "Some error occurred while retrieving data."
        });
    });
    console.log(data);
    const returnObj = {
        count: data.count,
        next: offset + 1,
        previous: offset - 1,
        results: data.rows
    };
    res.status(200).json(returnObj);
}


module.exports = {
    saveInquiry,
    fetchBookingByCustomerId
};





