const db = require("../models");
var _ = require('../startup/load-lodash')();
var moment = require('moment');
const { getIdParam } = require('./helper');
const Op = db.Sequelize.Op;
const crypto = require('crypto');
const getAll = require('../common/get-all');

async function saveData(req, res) {
    // return res.status(200).send(req.body);
    console.log(req.body);
    await (db.sequelize).transaction(async function (transactional) {
        req.body.docUuid =  crypto.randomBytes(20).toString('hex');
        const documentDetails = await (db.documents).create(req.body, { transaction: transactional });

       

        // TODO: Update Vehicle Odometer Reading.....

        return res.status(200).send(documentDetails);
    });
}



async function fetchAllResourceType(req, res, next) {
    // console.log(key);
    let whereCondition = { resourceId: req.params.resourceId,resourceType:req.params.resourceType };
    const dataSet = await (db.documents).findAll({ where: whereCondition }).catch(error => {
        return res.status(500).send({
            message:
            error.message || "Some error occurred while retrieving data."
        });
    });
    next();
    res.status(200).json({ msg: 'success', data: dataSet != null ? dataSet : {} });
}

async function findAll(req, res) {
    const limit = req.query.pageSize ? +(req.query.pageSize) : 10;
    // const offset = const limit = size ? +size : 3;
    const offset = req.query.page ? req.query.page * limit : 0;
    const data = await (db.bookingExtension).findAndCountAll({ limit, offset , order: [
        // Will escape title and validate DESC against a list of valid direction parameters
        ['createdOn', 'DESC']]}).catch(error => {
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

async function test(req,res,next){

 getAll(_,db,'documents')(req,res);
//    next();
}

module.exports = {
    saveData,
    fetchAllResourceType,
    findAll,
    test
}











