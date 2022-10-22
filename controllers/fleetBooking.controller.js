const db = require("../models");
var _ = require('../startup/load-lodash')();
var moment = require('moment');
// console.log(db.customer);
const Tutorial = db.customer;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {

    var date = moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate(), code;
    (db.fleetBookingSeq).create({ created_on: date }).then((resp) => {
        code = 'WCBLRINQ';
        if (resp.id < 1000) {
            code = 'WCBLRINQ' + '0' + resp.id;
        } else {
            code = 'WCBLRINQ' + resp.id;
        }
        console.log(req.body);
        return (db.fleetBooking).create(req.body)
        // res.status(200).json(code);
    }).then((resp) => {
        res.status(200).json(code);
    });

    // return config.svc.commonCreateEntity({body: { createdAt: date},user: req.user,key: entity}, req).then((seq) => {
    //   var code = '';
    //   if (seq.id < 1000) {
    //     code = bookingCode + '0' + seq.saved.id;
    //   } else {
    //     code = bookingCode + seq.saved.id;
    //   }
    //   return config.Promise.resolve(code);
    // });



};

exports.findAll = (req, res) => {
    const limit = req.query.pageSize ? +(req.query.pageSize) : 10;
	// const offset = const limit = size ? +size : 3;
	const offset = req.query.page ? req.query.page * limit : 0;
    (db.fleetBooking).findAndCountAll({ limit, offset })
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
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });

};

exports.findOne=(req,res)=>{
    const id = req.params.id;

    (db.fleetBooking).findByPk(id)
      .then(data => {
        if (data) {
          res.status(200).json({status:'success',data:data});
        } else {
          res.status(404).send({
            message: `Cannot find booking with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving booking with id=" + id
        });
      });
}
