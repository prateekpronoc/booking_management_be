const db = require("../models");
var _ = require('../startup/load-lodash')();
var moment = require('moment');
const { getIdParam } = require('./helper');
const Op = db.Sequelize.Op;
const crypto = require('crypto');

// exports.create = (req, res) => {
//     // req.body.paymentUuid = crypto.randomBytes(20).toString('hex');
//     return (db.bookingLineItem).create(req.body).then((resp) => {
//         res.status(200).json(resp);
//     });
// };

// exports.findAllByBookingId = (req, res) => {
//     console.log(req.params.lineItemType);
//     return (db.bookingLineItem).findAndCountAll(
//         {
//             where:
//             {
//                 bookingId: req.params.bookingId,
//                 lineItemType: req.params.lineItemType
//             }
//         }).then((resp) => {
//             res.status(200).send(resp);
//         });
// }

async function saveData(req, res) {
    await (db.sequelize).transaction(async function (transactional) {

        const bookingLineItem = await (db.bookingLineItem).create(req.body, { transaction: transactional });

        const bookingUpdateObject = {
            totalRent: req.body.totalRent
        };

        if (_.has(req.body, 'isRefund') && req.body.isRefund) {
            bookingUpdateObject.refundableAmount = req.body.refundableAmount;
        }

        const bookingData = await (db.fleetBooking).update(bookingUpdateObject,
            {
                where: {
                    id: req.body.bookingId
                }
            }, { transaction: transactional });


        // TODO: Update Vehicle Odometer Reading.....

        return res.status(200).send(bookingLineItem);
    });
}

async function findAllByBookingId(req, res) {

    const dataSet = await (db.bookingLineItem).findAndCountAll(
        {
            where:
            {
                bookingId: req.params.bookingId,
                lineItemType: req.params.lineItemType
            }
        }
    );

   return res.status(200).send(dataSet);

}

module.exports = {
    saveData,
    findAllByBookingId
}