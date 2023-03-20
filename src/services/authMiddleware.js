const jwt = require("jsonwebtoken");
require('dotenv').config();
import { resolve } from 'path';
import util from 'util';
import * as redis from 'redis';  // Dòng này đc thêm vào để fix lỗi TypeError: Cannot read properties of undefined (reading 'createClient')
const client = redis.createClient({
    legacyMode: true
}); //Thêm lagacyMode để tránh bug là ClientClosedError: The client is closed

client
    .connect()
    .catch((err) => {
        console.log('err happened' + err);
    });


exports.loggedIn = async function (req, res, next) {
    try {
        // get access token and refresh token
        const Rtoken = req.cookies.refresh_token;
        let Atoken = req.cookies.access_token;
        const RPayload = jwt.verify(Rtoken, process.env.TOKEN_SECRET); // kiểm tra xem refresh token có hợp lệ hay còn hiệu lực hay không 
        const hexistAsync = util.promisify(client.hExists).bind(client);
        const result = await hexistAsync(RPayload.id, Rtoken);

        if (result == 1) {
            res.redirect('/login-form');
        }
        const APayload = jwt.verify(Atoken, process.env.TOKEN_SECRET, { ignoreExpiration: true }); // dòng này chỉ để lấy data của access token
        const time_now = Math.round(Date.now() / 1000); //get thời gian(giây) hiện tại so với năm 1970
        // Nếu access token hết hạn thì cấp cho access token mới 
        if (time_now >= APayload.exp) {
            Atoken = jwt.sign({ id: APayload.id }, process.env.TOKEN_SECRET, { expiresIn: '10m' });
            next();
        } else if (time_now < APayload.exp) {
            next();
        }
    } catch (error) {
        console.log("error :", error);
        res.redirect('/');
    }
}

