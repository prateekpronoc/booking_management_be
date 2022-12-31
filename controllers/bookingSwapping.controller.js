const db = require("../models");
var _ = require('../startup/load-lodash')();
var moment = require('moment');
const { getIdParam } = require('./helper');
const Op = db.Sequelize.Op;
const crypto = require('crypto');


async function saveData(req, res) {

    await (db.sequelize).transaction(async function (transactional) {
        req.body.rowUuid = crypto.randomBytes(20).toString('hex');
        const swappingDatails = await (db.fleetBookingSwappings).create(req.body, { transaction: transactional });

        const bookingUpdateObject = req.body.bookingObject;
        // bookingUpdateObject.endDate = req.body.endDate;

        const bookingData = await (db.fleetBooking).update(bookingUpdateObject,
            {
                where: {
                    id: req.body.bookingId
                }
            }, { transaction: transactional });

        if (_.has(req.body, 'paymentObject')) {
            const paymentData = await (db.bookingPayments).create(req.body.paymentObject, { transaction: transactional });
        }

        // TODO: Update Vehicle Odometer Reading.....

        return res.status(200).send(swappingDatails);
    });
}




module.exports = {
    saveData
}











