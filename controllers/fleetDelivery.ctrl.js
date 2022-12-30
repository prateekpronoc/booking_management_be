const db = require("../models");
var _ = require('../startup/load-lodash')();
var moment = require('moment');
const { getIdParam } = require('./helper');
const Op = db.Sequelize.Op;
const crypto = require('crypto');
const { sequelize } = require('sequelize');
const c = require("config");


async function saveData(req, res) {
    try {
        await (db.sequelize).transaction(async function (transactional) {

            console.log(req.body);
            const savedDataValue = await (db.allDelivery).update(req.body,
                {
                    where: {
                        id: req.body.id
                    }
                }, { transaction: transactional });

            return res.status(200).send(savedDataValue);
        });
        console.log('success');
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    saveData
};





