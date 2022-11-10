
const database = require('../../models');
var _ = require('../../startup/load-lodash')();
exports.userAuth = (req, res, next) => {
    
    // res.send('12312');
    authenticateUsers(req.body).then((resp)=>{
        const returnObject = {entity:_.omit(resp,'password'),msg:'success'};
        res.status(200).send(returnObject);
    }).catch(err=>{
        next(err)
    });   
}

function authenticateUsers(user){
    return new Promise((resolve, reject) => {
        try {
            (database.users).findOne({
                where: {
                    username: user.un // user email
                }
            }).then(async (response) => {
                if (!response) {
                    resolve(false);
                } else {
                    if (!response.dataValues.password ||
                        !await response.validPassword(user.pwd,
                            response.dataValues.password)) {
                        resolve(false);
                    } else {
                        resolve(response.dataValues)
                    }
                }
            })
        } catch (error) {
            const response = {
                status: 500,
                data: {},
                error: {
                    message: "user match failed"
                }
            };
            reject(response);
        }
    })
}