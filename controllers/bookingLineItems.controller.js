const db = require("../models");
var _ = require('../startup/load-lodash')();
var moment = require('moment');
const { getIdParam } = require('./helper');
const Op = db.Sequelize.Op;
const crypto = require('crypto');

exports.create = (req, res) => {
    // req.body.paymentUuid = crypto.randomBytes(20).toString('hex');
    return (db.bookingLineItem).create(req.body).then((resp) => {
        res.status(200).json(resp);
    });
};

exports.findAllByBookingId = (req, res) => {
    console.log(req.params.lineItemType);
    return (db.bookingLineItem).findAndCountAll(
        {
            where:
            {
                bookingId: req.params.bookingId,
                lineItemType: req.params.lineItemType
            }
        }).then((resp) => {
            res.status(200).send(resp);
        });
}