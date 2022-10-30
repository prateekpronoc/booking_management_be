const db = require("../models");
var _ = require('../startup/load-lodash')();
var moment = require('moment');
const { getIdParam } = require('./helper');
const Op = db.Sequelize.Op;
const crypto = require('crypto');

// exports.findAll = (req, res) => {
//     const limit = req.query.pageSize ? +(req.query.pageSize) : 10;
//     // const offset = const limit = size ? +size : 3;
//     const offset = req.query.page ? req.query.page * limit : 0;


//     (db.bookingPayments).findAndCountAll({ limit, offset })
//         .then(data => {
//             const returnObj = {
//                 count: data.count,
//                 next: offset + 1,
//                 previous: offset - 1,
//                 results: data.rows
//             };
//             res.status(200).json(returnObj);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while retrieving tutorials."
//             });
//         });
// };

// exports.create = (req, res) => {
// 	req.body.paymentUuid = crypto.randomBytes(20).toString('hex');
// 	return (db.bookingPayments).create(req.body).then((resp) => {
//         res.status(200).json(resp);
//     });
// };

// exports.findAllByBookingId= (req,res)=>{
//     return (db.bookingPayments).findAndCountAll({where:{bookingId: req.params.bookingId}}).then((resp)=>{
//         res.status(200).send(resp);
//     })
// }

async function create(req, res){
    req.body.paymentUuid = crypto.randomBytes(20).toString('hex');
    const bookingPayment = await (db.bookingPayments).create({ created_on: date }, { transaction :transactional});

    if(_.has(req.body,'changeStatus') && req.body.changeStatus){
        const bookingData = await (db.fleetBooking).update({status:'Pending'},
            {
                where: {
                    id: req.body.bookingId
                }
            },{transaction:transactional});
    }

    return res.status(200).send(bookingPayment);
}

async function findAllByBookingId(req, res){
    const paymentData = await (db.bookingPayments).findAndCountAll({where:{bookingId: req.params.bookingId}});
    res.status(200).send(paymentData);
}

module.exports ={
    findAllByBookingId,
    create
}





