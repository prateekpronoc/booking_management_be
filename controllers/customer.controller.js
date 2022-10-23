const db = require("../models");
var _ = require('../startup/load-lodash')();
// console.log(db.customer);
const Customers = db.customer;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {

};

exports.searchData = (req, res) => {
    let columns = [];
    for (let key in Customers.rawAttributes) {
        columns.push(key);
    }
    var exCols = _.intersection(_.keys(req.query), columns);
    var whereConditions = _.pick(req.query, exCols);
    (db.customer).findAll({ where: whereConditions }).then((resp) => {
        res.send(resp);
    });
};

exports.searchByName = (req, res) => {
    // console.log(req.params.name);
    searchByName(req.params.name).then((resp)=>{
        res.status(200).json(resp);
    })

}

//Method to run the query for Name search
const searchByName = async (queryData) => {
    const rows = await Customers.findAll({
        where: {
            name: {
                [Op.like]: '%' + queryData + '%'
            }
        }
    });
    // console.log(rows);
    return rows;
}

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    for (let key in Tutorial.rawAttributes) {
        console.log('Field: ', key); // this is name of the field
        // console.log('TypeField: ', Model.rawAttributes[key].type.key); // Sequelize type of field
    }
    (db.customer).findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

// Find a single Tutorial with an id
exports.findOneByName = (req, res) => {
    let whereCondition = { name: req.params.name }
    searchCustomer(whereCondition).then((resp) => {
        res.status(200).json(resp)
    })
    // (db.customer).findOne({ where: { name: req.body.anme } }).then
};


async function searchCustomer(whereCondition) {
    const project = await (db.customer).findOne({ where: whereCondition });
    if (project === null) {
        console.log('Not found!');
    } else {
        return project
        // console.log(project instanceof Project); // true
        // console.log(project.title); // 'My Title'
    }
    // try {
    //     const msg = await sequelize.query(
    //         queryString,
    //         {
    //             replacements: dt,
    //             type: QueryTypes.SELECT
    //         }
    //     );
    //     // console.log(msg)
    //     return msg;
    // } catch (error) {
    //     console.error(error)
    // }
    // console.log("Outside")
}