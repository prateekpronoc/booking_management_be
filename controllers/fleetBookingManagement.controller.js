const db = require("../models");
var _ = require('../startup/load-lodash')();
var moment = require('moment');
const { getIdParam } = require('./helper');
const Op = db.Sequelize.Op;
const crypto = require('crypto');
const { sequelize } = require('sequelize');
const c = require("config");


async function initiateBooking(req, res) {
    try {
        await (db.sequelize).transaction(async function (transactional) {

            var date = moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate(), code;

            const bookingSeq = await (db.bookingSeq).create({ created_on: date }, { transaction: transactional });

            code = 'WCBLR' + moment().format('MMYY') + '-';
            if (bookingSeq.id < 1000) {
                code = code + '0' + bookingSeq.id;
            } else {
                code = code + bookingSeq.id;
            }

            req.body.bookingCode = code;
            req.body.bookingUuid = crypto.randomBytes(20).toString('hex');
            // console.log(req.body);
            const bookingData = await (db.fleetBooking).update(req.body,
                {
                    where: {
                        id: req.body.id
                    }
                }, { transaction: transactional });


            const tempBookingData = await (db.tempBookings).create(req.body.tempBookingObject, { transactional: transactional });

            const bookingHistory = await (db.bookingHistory).create(req.body.bookingHistoryObject, { transactional: transactional });

            req.body.deliveryObject.bookingCode = req.body.bookingCode;
            const bookingDelivery = await (db.allDelivery).create(req.body.deliveryObject, { transactional: transactional });

            let trackingObject = {
                bookingCode : req.body.bookingCode,
                destinationAddress : req.body.deliveryObject.deliveryAddress
            };

            const bookingDeliveryTracking = await (db.fleetDeliveryTracking).create(trackingObject, { transactional: transactional });

            return res.status(200).send(bookingData);
        });
        console.log('success');
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    initiateBooking
};





