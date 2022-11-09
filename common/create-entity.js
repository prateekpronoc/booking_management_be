module.exports = (_, database, key) => {
    return async  (req, res, next) => {
        await(database.sequelize).transaction(async function (transactional) {
            // req.body.docUuid = crypto.randomBytes(20).toString('hex');
            const entityDetails = await (database[key]).create(req.body, { transaction: transactional });
             res.status(200).send({status:'success',entity:entityDetails});
        });
    }
}