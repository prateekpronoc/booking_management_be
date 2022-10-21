const db = require("../models");
var _ = require('../startup/load-lodash')();
// console.log(db.customer);
const Tutorial = db.customer;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {

};

exports.searchData = (req,res)=>{
    let columns=[];
    for( let key in Tutorial.rawAttributes ){
        columns.push(key);
        // console.log('Field: ', key); // this is name of the field
        // console.log('TypeField: ', Model.rawAttributes[key].type.key); // Sequelize type of field
    }

    var exCols = _.intersection(_.keys(req.query), columns);
    console.log(exCols)
    var whereConditions = _.pick(req.query, exCols);
    (db.customer).findAll({where : whereConditions}).then((resp)=>{
        res.send(resp);
    });
    
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    for( let key in Tutorial.rawAttributes ){
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
    let whereCondition= {name:req.params.name}
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