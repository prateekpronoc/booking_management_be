const db = require("../models");
var _ = require('../startup/load-lodash')();
var moment = require('moment');
const { getIdParam } = require('./helper');
const Op = db.Sequelize.Op;
const crypto = require('crypto');
const getAll = require('../common/get-all');
const createEnity = require('../common/create-entity');
const getdbKey = require('../common/get-db-key');
let helpMehtod = require('../services/prepare-conditions');
//Create
async function saveData(req, res) {
    var dbKey = await getdbKey(req.baseUrl, req.config)();
    // console.log(dbKey);
    if (req.body && !_.has(req.body, 'id')) {
        await (db.sequelize).transaction(async function (transactional) {
            // req.body.docUuid = crypto.randomBytes(20).toString('hex');
            const entityDetails = await (db[dbKey]).create(req.body, { transaction: transactional });
            res.status(200).send({ status: 'success', entity: entityDetails });
        });
    } else {
        await (db.sequelize).transaction(async function (transactional) {
            const entityUpdateObject = await (db[dbKey]).update(req.body, {
                where: {
                    id: req.body.id
                }
            }, { transaction: transactional });
            res.status(200).json({
                status: "success",
                entity: req.body
            });
        });
    }

}

async function getEntityById(req, res) {
    var dbKey = await getdbKey(req.baseUrl, req.config)();
    await (db.sequelize).transaction(async function (transactional) {
        // req.body.docUuid = crypto.randomBytes(20).toString('hex');
        const entityDetails = await (db[dbKey]).findByPk(req.params.id, { transaction: transactional });
        res.status(200).send({ status: 'success', entity: entityDetails });
    });
}



async function fetchAllResourceType(req, res, next) {
    // console.log(key);
    let whereCondition = { resourceId: req.params.resourceId, resourceType: req.params.resourceType };
    const dataSet = await (db.documents).findAll({ where: whereCondition }).catch(error => {
        return res.status(500).send({
            message:
                error.message || "Some error occurred while retrieving data."
        });
    });
    next();
    res.status(200).json({ msg: 'success', data: dataSet != null ? dataSet : {} });
}

async function fetchData(query,dbKey){
    let limit =query.limit,offset = query.offset;
    const data = await (db[dbKey]).findAndCountAll({limit,offset,
        order: [
            // Will escape title and validate DESC against a list of valid direction parameters
            query.order],
         where : query.where   
    });
    return data;
}

//Get All with Paging
async function findAllWithPaging(req, res) {
     // console.log(req.query);
    if (!_.has(req.query, 'indixify')) {
        var dbKey = await getdbKey(req.baseUrl, req.config)();
        let columns = [];

        const limit = req.query.limit ? +(req.query.limit) : 10;
        // const offset = const limit = size ? +size : 3;
        const offset = req.query.offset ? req.query.offset * limit : 0;
        for( let key in (db[dbKey]).rawAttributes)  {
            columns.push(key);
           
      }
    //   console.log(columns);
        let query = {};
        helpMehtod({},_)(db, req.query, dbKey, columns).then((resp)=>{
            console.log(resp);
            query = resp;
            return fetchData(query,dbKey);
            // const data = await (db[dbKey]).findAndCountAll(query).catch(error => {
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
        }).then((data)=>{
            // console.log(data);
            const returnObj = {
                count: data.count,
                next: offset + 1,
                previous: offset - 1,
                results: data.rows
            };
            res.status(200).json(returnObj);
        })
        // res.status(200).json({});
        // const limit = req.query.limit ? +(req.query.limit) : 10;
        // // const offset = const limit = size ? +size : 3;
        // const offset = req.query.offset ? req.query.offset * limit : 0;
        // let whereCondition = {};
       
    }else{
        var dbKey = await getdbKey(req.baseUrl, req.config)();
        // const limit = req.query.limit ? +(req.query.limit) : 10;
        // // const offset = const limit = size ? +size : 3;
        // const offset = req.query.offset ? req.query.offset * limit : 0;
        const data = await (db[dbKey]).findAll({
            order: [
                // Will escape title and validate DESC against a list of valid direction parameters
                ['createdOn', 'DESC']],
            attributes: ['id', 'name']
        }).catch(error => {
            return res.status(500).send({
                message:
                    error.message || "Some error occurred while retrieving data."
            });
        });
        const returnObj = {
            status : 'success',
            results: _.indexify(data,'id','name')
        };
        res.status(200).json(returnObj);
    }
}

async function test(req, res, next) {

    getAll(_, db, 'documents')(req, res);
    //    next();
}

async function indexify(req, res, next) {
    console.log(baseUrl);
    var dbKey = await getdbKey(req.baseUrl, req.config)();
    // const limit = req.query.limit ? +(req.query.limit) : 10;
    // // const offset = const limit = size ? +size : 3;
    // const offset = req.query.offset ? req.query.offset * limit : 0;
    const data = await (db[dbKey]).findAll({
        order: [
            // Will escape title and validate DESC against a list of valid direction parameters
            ['createdOn', 'DESC']],
        attributes: ['id', 'name']
    }).catch(error => {
        return res.status(500).send({
            message:
                error.message || "Some error occurred while retrieving data."
        });
    });
    // const returnObj = {
    //     count: data.count,
    //     next: offset + 1,
    //     previous: offset - 1,
    //     results: data.rows
    // };
    res.status(200).json(data);
}

module.exports = {
    saveData,
    findAllWithPaging,
    getEntityById,
    indexify
}











