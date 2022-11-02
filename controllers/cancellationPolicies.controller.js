const db = require("../models");
var _ = require('../startup/load-lodash')();
var moment = require('moment');
const { getIdParam } = require('./helper');
const Op = db.Sequelize.Op;
const crypto = require('crypto');


async function saveData(req, res) {
    
    await (db.sequelize).transaction(async function (transactional) {

        const cancellationPolicies = await (db.cancellationPolicies).create(req.body, { transaction: transactional });

        return res.status(200).send(cancellationPolicies);
    });
}


async function fetchAll(req, res) {
    const limit = req.query.pageSize ? +(req.query.pageSize) : 10;
    // const offset = const limit = size ? +size : 3;
    const offset = req.query.page ? req.query.page * limit : 0;
    const data = await (db.cancellationPolicies).findAndCountAll({limit,offset}).catch(error => {
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




async function findOneByBookingId(req, res) {
    let bookingId = req.params.bookingId;
    let whereCondition = { bookingId: req.params.bookingId }
    const dataSet = await (db.cancellationPolicies).findOne({ where: whereCondition }).catch(error => {
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
    fetchAll
}











