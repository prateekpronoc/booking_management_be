const db = require("../models");
var _ = require('../startup/load-lodash')();
var moment = require('moment');
const { getIdParam } = require('./helper');
const Op = db.Sequelize.Op;
const crypto = require('crypto');

exports.findAll = (req, res) => {
    const limit = req.query.pageSize ? +(req.query.pageSize) : 10;
    // const offset = const limit = size ? +size : 3;
    const offset = req.query.page ? req.query.page * limit : 0;


    (db.bookingTripEndInfo).findAndCountAll({ limit, offset })
        .then(data => {
            const returnObj = {
                count: data.count,
                next: offset + 1,
                previous: offset - 1,
                results: data.rows
            };
            res.status(200).json(returnObj);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving data."
            });
        });
};

exports.create = (req, res) => {
	req.body.paymentUuid = crypto.randomBytes(20).toString('hex');
	return (db.bookingTripEndInfo).create(req.body).then((resp) => {
        
        res.status(200).json(resp);
    });
};

exports.update = (req,res)=>{
    const id = req.params.id;

    db.bookingTripEndInfo.update(req.body, {
      where: { id: id }
    }) .then(num => {
        if (num) {
          res.status(200).json({
            msg: "Data was updated successfully.",
            data: req.body
          });
        } else {
          res.status(201).json({
            msg: `Cannot update Data with id=${id}. Maybe Data was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).send({
          msg: "Error updating Data with id=" + id
        });
      });
}

exports.findOneByBookingId = (req,res)=>{
    let bookingId = req.params.bookingId;
    let whereCondition = { bookingId: req.params.bookingId }
    searchBookingTripEndDetails(whereCondition).then((resp) => {
        // console.log(resp);
        if(res=='null'){
           return res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        }else{
            
        res.status(200).json({msg:'success',data: resp!=null ? resp: {}});}
    })
   
}

async function searchBookingTripEndDetails(whereCondition){
    const dataSet= await (db.bookingTripEndInfo).findOne({ where: whereCondition }).catch(error => {return 'null';});;
    return dataSet;
}

// module.exports ={
//     findAll
// }





