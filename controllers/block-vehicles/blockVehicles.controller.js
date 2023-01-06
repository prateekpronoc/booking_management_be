const db = require("../../models");
var _ = require('../../startup/load-lodash')();
var moment = require('moment');
const { getIdParam } = require('../helper');
const Op = db.Sequelize.Op;
const crypto = require('crypto');


async function saveData(req, res) {

    await (db.sequelize).transaction(async function (transactional) {

        if (!_.has(req.body, 'id')) {

            const blockVehicles = await (db.blockedVehicles).create(req.body, { transaction: transactional });



            let vehicleUpdateObject = {};

            if (req.body.isUnblocked == 0) {
                vehicleUpdateObject.currentStatus = 'Blocked';
                vehicleUpdateObject.status = 0;
            } else {
                vehicleUpdateObject.currentStatus = 'Active';
                vehicleUpdateObject.status = 1;
            }

            const vehicleUpdate = await (db.vehicles).update(vehicleUpdateObject, {
                where: {
                    id: req.body.vehicleId
                }
            }, { transaction: transactional });

            return res.status(200).send(blockVehicles);
        } else {
            const blockVehicles = await (db.blockedVehicles).update(req.body, {
                where: {
                    id: req.body.id
                }
            }, { transaction: transactional });



            let vehicleUpdateObject = {};

            if (req.body.isUnblocked == 0) {
                vehicleUpdateObject.currentStatus = 'Blocked';
                vehicleUpdateObject.status = 0;
            } else {
                vehicleUpdateObject.currentStatus = 'Active';
                vehicleUpdateObject.status = 1;
            }

            const vehicleUpdate = await (db.vehicles).update(vehicleUpdateObject, {
                where: {
                    id: req.body.vehicleId
                }
            }, { transaction: transactional });

            return res.status(200).send(blockVehicles);
        }
    });
}

module.exports = {
    saveData
}