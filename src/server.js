import express from 'express';
import configViewEngine from './configs/viewEngine.js';
import initWebRoute from './route/web.js';
import initAPIRoute from './route/apiRoute.js';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import cookies from 'cookie-parser';
import passport from 'passport';
import connection from './configs/connectDB.js';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config()


// connect redis
// import connectRedis from './configs/connectRedis';
// connectRedis.connectRedis();

import redis from 'redis';
const client = redis.createClient({
    host: process.env.REDISHOST,
    port: process.env.REDISPORT,
    password: process.env.REDISPASSWORD,
    url: process.env.REDIS_URL,
    legacyMode: true
});


client
    .connect()
    .catch((err) => {
        console.log('err happened' + err);
    });

;

var app = express();


// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream('access.log', { flags: 'a' })
// The createWriteStream(path, options) method is an inbuilt application programming interface of fs module which allows to quickly make a writable stream 
// for the purpose of writing data to a file. This method may be a smarter option compared to methods like fs.writeFile when it comes to very large amounts of data.
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

// get data from client 
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'https://chat-app-realtime.up.railway.app', //Chan tat ca cac domain khac ngoai domain nay
    credentials: true //Để bật cookie HTTP qua CORS
}))
app.use(cookies());


app.use(passport.initialize());
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "https://chat-app-realtime.up.railway.app/auth/facebook/callback",
    enableProof: true, // We also set enableProof: true to include a proof of authentication in the access token.
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'displayName', 'timezone', 'updated_time', 'verified']
}, function (accessToken, refeshToken, profile, done) { // this function must have 4 parameters, refresh token is optional paramesters
    var user = {
        'name': profile.displayName,
        'email': profile.emails[0].value,
        'id': profile.id,
        'accessToken': accessToken
    }
    return done(null, user); // value profile.id passed to route' controller as `req.user`
}
));

// authentication with google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "https://chat-app-realtime.up.railway.app/auth/google/callback",
    enableProof: true, // We also set enableProof: true to include a proof of authentication in the access token.
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'displayName', 'timezone', 'updated_time', 'verified']
}, function (accessToken, refeshToken, profile, done) { // this function must have 4 parameters, refresh token is optional paramesters
    var user = {
        'name': profile.displayName,
        'email': profile.email,
        'id': profile.id,
        'accessToken': accessToken
    }
    return done(null, user); // value profile.id passed to route' controller as `req.user`
}
));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// set up view engine
configViewEngine(app);

// init web route
initWebRoute(app);

// init api route
initAPIRoute(app);

app.use((req, res) => { // Bind application-level middleware to an instance of the app object by using the app.use() 
    res.render('404.ejs');
})

// setting socket.io
import http from 'http';
var server = http.createServer(app);
const hostname = '0.0.0.0';

import { Server } from 'socket.io';

const io = new Server(server);

io.on('connection', (socket) => {

    socket.on('checkID', id => {
        if (id) {
            const roomID = id.userID + id.friendId;
            let room_id = roomID; // khởi tạo thêm một biến room_id là nếu roomID bị ngược thì gán room_id mới

            let message = '[]';

            // check user is exist in message table or not
            connection.execute('SELECT * FROM `message` WHERE `room_id` = ? OR `room_id` = ?', [roomID, id.friendId + id.userID]).then(result => {
                if (result[0][0]) {
                    room_id = result[0][0].room_id;
                    socket.emit('roomID', { room_id, id });
                } else {
                    connection.execute('INSERT INTO inboxs(user_id, room_id) VALUES(?, ?)', [id.friendId, roomID]);
                    connection.execute('INSERT INTO message(room_id, message) VALUES(?, ?)', [roomID, message]);
                    socket.emit('roomID', { room_id, id });

                }
            });

        }
    })

    let room_id = '';

    socket.on('join', data => { // data have roomID and userID
        room_id = data.roomID;
        socket.join(data.roomID);
    })

    socket.on('leave', data => {
        room_id = data.roomID;
        socket.leave(room_id);
    })

    socket.on('chat-message', (message) => { // object message have 3 properties : userID , friendid and message
        // query data to get message of two user
        connection.execute('SELECT * FROM `message`WHERE `room_id` = ?', [room_id]).then(result => {
            let mess = JSON.parse(result[0][0].message); // result[0][0].message is text => mess is array

            let new_message = [message.userID, message.message];
            mess.push(new_message);

            mess = JSON.stringify(mess); // convert mess to string

            connection.execute('UPDATE message SET message = ? WHERE room_id = ?', [mess, room_id]); // update new message to database

            // Send a message to all sockets in the 'room_id' room
            io.to(room_id).emit('chat-reply', { userID: message.userID, message: message.message });
        })
    })

    socket.on('close-video-call', () => {
        // Send a message to all sockets in the 'room_id' room except for the sender
        socket.to(room_id).emit('response-to-close-video-call');
    })

})

server.listen(process.env.PORT || 3000, hostname, () => console.log(`Server has started ${process.env.PORT}`));