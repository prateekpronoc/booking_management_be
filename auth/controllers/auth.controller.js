
const database = require('../../models');
var _ = require('../../startup/load-lodash')();
exports.userAuth = (req, res, next) => {
    
    // res.send('12312');
    authenticateUsers(req.body).then((resp)=>{
        const returnObject = {entity:_.omit(resp,'password'),msg:'success'};
        res.status(200).send(_.omit(resp,'password'));
    }).catch(err=>{
        res.status(401).send(err);
        // console.log(err);
        // next(err)
    });   
}

function authenticateUsers(user){
    const errorResponse = {
        status: 500,
        data: {},
        error: {
            message: "user match failed"
        }
    };
    return new Promise((resolve, reject) => {
        try {
            (database.users).findOne({
                where: {
                    username: user.un // user email
                }
            }).then(async (response) => {
                if (!response) {
                    reject(errorResponse);
                } else {
                    if (!response.dataValues.password ||
                        !await response.validPassword(user.pwd,
                            response.dataValues.password)) {
                        reject(errorResponse);
                    } else {
                        resolve(response.dataValues)
                    }
                }
            })
        } catch (error) {
           
            reject(errorResponse);
        }
    })
}