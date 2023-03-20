import connection from "../configs/connectDB";
const User = require("../configs/regisUser");
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
require('dotenv').config();
const { NotFoundError } = require("../services/utility");
import { v4 as uuidv4 } from 'uuid';
import * as redis from 'redis'; // Dòng này đc thêm vào để fix lỗi TypeError: Cannot read properties of undefined (reading 'createClient')
const { loggedIn } = require("../services/authMiddleware");
import checkingUser from '../configs/connectDB_passportjs';

const client = redis.createClient({
    legacyMode: true
}); //Thêm lagacyMode để tránh bug là ClientClosedError: The client is closed

client
    .connect()
    .catch((err) => {
        console.log('err happened' + err);
    });

// Register a new User
let register = async (req, res) => {
    // generate random id for user
    const userID = uuidv4();
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hasPassword = await bcrypt.hash(req.body.password, salt);

    // Create an user object
    const user = new User({
        mobile: req.body.mobilenumber,
        email: req.body.email,
        name: req.body.username,
        password: hasPassword,
        userID: userID,
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
        console.log("error in crete user")
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
            }
            // Create and assign token
            const Atoken = await jwt.sign({ id: user[0].userID }, process.env.TOKEN_SECRET, { expiresIn: '10m' });
            // store token in cookie so that people cant access token in brower using javascript 
            await res.cookie('access_token', Atoken, {
                httpOnly: true,
                //secure: true;
            })

            // create refesh token 
            const Rtoken = await jwt.sign({ id: user[0].userID }, process.env.TOKEN_SECRET, { expiresIn: '30d' });
            await res.cookie('refresh_token', Rtoken, {
                httpOnly: true,
                //secure: true;
            })
            res.status(200).redirect('/home');
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


let logout = async (req, res) => {
    try {
        const Rtoken = req.cookies.refresh_token;
        const RPayload = jwt.verify(Rtoken, process.env.TOKEN_SECRET);
        const time_now = Math.round(Date.now() / 1000);
        const time_live = RPayload.exp - time_now;

        await client.hSet(RPayload.id, Rtoken, "");
        await client.expire(`${RPayload.id}:${Rtoken}`, time_live);
        return res.status(200).redirect('/');
    }
    catch (error) {
        console.log("error", error);
    }
}


let init_RToken_AToken_for_FB_GG = async (req, res, next) => {
    var result = await checkingUser(req.user);

    // Create and assign token
    const Atoken = jwt.sign({ id: req.user.id }, process.env.TOKEN_SECRET, { expiresIn: '10m' }); // req.user is id of user
    // store token in cookie so that people cant access token in brower using javascript 
    await res.cookie('access_token', Atoken, {
        httpOnly: true,
        //secure: true;
    })

    // create refesh token 
    const Rtoken = jwt.sign({ id: req.user.id }, process.env.TOKEN_SECRET, { expiresIn: '30d' });
    await res.cookie('refresh_token', Rtoken, {
        httpOnly: true,
        //secure: true;
    })

    res.redirect('/home');
}

let checkingCookie = (req, res, next) => {
    const refreshToken = req.cookies.refresh_token;
    const accessToken = req.cookies.access_token;
    // Check if tokens exist
    if (!refreshToken || !accessToken) {
        return res.redirect('/login-form');
    } else {
        next();
    }
}

module.exports = {
    login,
    register,
    logout,
    init_RToken_AToken_for_FB_GG,
    checkingCookie
}
