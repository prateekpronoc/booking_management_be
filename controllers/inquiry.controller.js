const db = require("../models");
var _ = require('../startup/load-lodash')();
var moment = require('moment');
const { getIdParam } = require('./helper');
const Op = db.Sequelize.Op;
const crypto = require('crypto');
const { sequelize}  = require('sequelize');


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
            const inquiry = await (db.fleetBooking).create(req.body,{transaction});

            
    

            return res.status(200).send(inquiry);
        });
        console.log('success');
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    saveInquiry
};





