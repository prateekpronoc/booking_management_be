const db = require("../models");
var _ = require('../startup/load-lodash')();
var moment = require('moment');
const { getIdParam } = require('./helper');
const Op = db.Sequelize.Op;
const crypto = require('crypto');
const getAll = require('../common/get-all');
const createEnity = require('../common/create-entity');
async function saveData(req, res) {

    createEnity(_,db,req.params.key)(req,res);
    
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

async function findAllWithPaging(req, res) {
    console.log(req.params);
    getAll(_,db,req.params.key)(req,res);
    // const limit = req.query.pageSize ? +(req.query.pageSize) : 10;
    // // const offset = const limit = size ? +size : 3;
    // const offset = req.query.page ? req.query.page * limit : 0;
    // const data = await (db.bookingExtension).findAndCountAll({ limit, offset , order: [
    //     // Will escape title and validate DESC against a list of valid direction parameters
    //     ['createdOn', 'DESC']]}).catch(error => {
    //     return res.status(500).send({
    //         message:
    //             error.message || "Some error occurred while retrieving data."
    //     });
    // });
    // const returnObj = {
    //     count: data.count,
    //     next: offset + 1,
    //     previous: offset - 1,
    //     results: data.rows
    // };
    // res.status(200).json(returnObj);
}

async function test(req,res,next){

 getAll(_,db,'documents')(req,res);
//    next();
}

module.exports = {
    saveData,
    findAllWithPaging
}











