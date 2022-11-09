module.exports = (_, database, key) => {
    return async (req, res,next) => {
        const limit = req.query.pageSize ? +(req.query.pageSize) : 10;
        // const offset = const limit = size ? +size : 3;
        const offset = req.query.page ? req.query.page * limit : 0;
        const data = await (database[key]).findAndCountAll({
            limit, offset, order: [
                // Will escape title and validate DESC against a list of valid direction parameters
                ['createdOn', 'DESC']]
        }).catch(error => {
            return res.status(500).send({
                message:
                    error.message || "Some error occurred while retrieving data."
            });
        });
        const returnObj = {
            count: data.count,
            next: offset + 1,
            previous: offset - 1,
            results: data.rows
        };
        res.status(200).json(returnObj);
        // next();
    }
}