const db = require("../models");
var _ = require('../startup/load-lodash')();
var moment = require('moment');
const { getIdParam } = require('./helper');
const Op = db.Sequelize.Op;
const crypto = require('crypto');
const { sequelize}  = require('sequelize');


async function initiateBooking(req, res) {
    try {
        await (db.sequelize).transaction(async function (transactional) {

            var date = moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate(), code;

            const bookingSeq = await (db.bookingSeq).create({ created_on: date }, { transaction :transactional});
            
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
                },{transaction:transactional});

            
            
           //TODO : Update Temp Table

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





