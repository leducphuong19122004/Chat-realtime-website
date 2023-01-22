import connection from "../configs/connectDB";
const User = require("../configs/regisUser");
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
require('dotenv').config();
const { NotFoundError } = require("../services/utility");

// Register a new User
let register = async (req, res) => {

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hasPassword = await bcrypt.hash(req.body.password, salt);

    // Create an user object
    const user = new User({
        mobile: req.body.mobilenumber,
        email: req.body.email,
        name: req.body.username,
        password: hasPassword,
        status: req.body.status || 1
    });
    // Save User in the database
    try {
        const id = await User.create(user);
        if (id == 1) {
            return res.send("email or mobile number existed");
        }
        res.render('login_form.ejs');
    }
    catch (err) {
        res.status(500).send(err);
    }
};

let login = async (req, res) => {
    try {
        // Check user exist
        const user = await User.login(req.body);
        if (user) {
            const validPass = await bcrypt.compare(req.body.password, user[0].password);
            if (!validPass) {
                return res.status(400).send("Mobile/Email or Password is wrong");
            } else {
                console.log("accept");
            }
            // Create and assign token
            const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);
            // store token in cookie so that people cant access token in brower using javascript 
            res.cookie('access_token', token, {
                maxAge: 365 * 24 * 60 * 60 * 100,
                httpOnly: true,
                //secure: true;
            })
            res.status(200).json({ ok: true });
        }
    }
    catch (err) {
        if (err instanceof NotFoundError) {
            res.status(401).send(`Mobile/Email or Password is wrong`);
        }
        else {
            console.log(err);
            let error_data = {
                entity: 'User',
                model_obj: { param: req.params, body: req.body },
                error_obj: err,
                error_msg: err.message
            };
            res.status(500).send("Error retrieving User");
        }
    }
};


// // Access auth users only
// let authuseronly = (req, res) => {
//     res.send("Hey,You are authenticated user. So you are authorized to access here.");
// };

// // Admin users only
// let adminonly = (req, res) => {
//     res.send("Success. Hellow Admin, this route is only for you");
// };

module.exports = {
    login,
    register
}
