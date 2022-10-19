const db = require("../models");
// console.log(db.customer);
// const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const limit = req.query.pageSize ? +(req.query.pageSize) : 10;
	// const offset = const limit = size ? +size : 3;
	const offset = req.query.page ? req.query.page * limit : 0;


    (db.dailRentalInquiry).findAndCountAll({limit,offset})
    .then(data => {
        const returnObj = {
            count: data.count,
            next: offset+1,
            previous: offset-1,
            results : data.rows
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

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  
};