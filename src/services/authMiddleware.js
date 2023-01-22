const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.loggedIn = function (req, res, next) {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).send("Access Denied");

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        next();
    }
    catch (err) {
        res.status(400).send("Invalid Token");
        throw (err);
    }
}

// exports.adminOnly = async function (req, res, next) {
//     if (req.user.user_type_id === 2) {
//         return res.status(401).send("Unauthorized!");
//     }
//     next();
// }