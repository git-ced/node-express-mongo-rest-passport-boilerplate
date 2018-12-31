//models
const User = require('../models/User')

//controllers
exports.index_GET = async(req, res) => {
    await User..find()
        .lean()
        .exec(function(err, results) {
            res.render("../views/pages/staff", {
                result: results,
            });
        });
}