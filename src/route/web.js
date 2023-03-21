import express from 'express';
import homeController from '../controller/homeController';
import authController from '../controller/authController';
import multer from "multer";
import path from 'path';
import passport from 'passport';
import { loggedIn } from '../services/authMiddleware';
import jwt from 'jsonwebtoken';



let router = express.Router();// Use the express.Router class to create modular, mountable route handlers

// This code below will create a router as a module, loads a middleware function in it, defines some routes, and mounts the router module on a path in the main app.
const initWebRoute = (app) => {
    router.get('/checking-before-login', authController.checkingCookie, loggedIn, homeController.redirectToHome);
    router.get('/', homeController.getStartPage);
    // routes for login and sign up
    router.get('/login-form', homeController.getLoginForm);
    router.get('/signup-form', homeController.getSignupForm);

    router.get('/home', authController.checkingCookie, loggedIn, homeController.getHomePage);

    router.get('/profile-user', authController.checkingCookie, loggedIn, homeController.getProfileUser);

    router.get('/chat', authController.checkingCookie, loggedIn, homeController.getChatPage);
    router.get('/chat/:roomID', authController.checkingCookie, loggedIn, homeController.showChatMessage);

    router.get('/list_friend', authController.checkingCookie, loggedIn, homeController.getListFriend);
    router.post('/getListFriend', authController.checkingCookie, loggedIn, homeController.searchListFriend);
    router.get('/edit-profile', authController.checkingCookie, loggedIn, homeController.editProfile)
    router.post('/save-profile', authController.checkingCookie, loggedIn, homeController.saveProfile);


    //cấu hình lưu trữ file khi upload xong
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'D:\\Nodejs\\src\\public\\fileUpload'); // cb is a callback function 
        },
        filename: function (req, file, cb) {
            const Rtoken = req.cookies.refresh_token;
            const RPayload = jwt.verify(Rtoken, process.env.TOKEN_SECRET);
            const time_now = Math.round(Date.now());
            const filename = time_now + "-" + RPayload.id;
            // fieldname is field name specified in the form
            // The path.extname() method returns the extension of the path
            cb(null, filename);
        }
    })

    let upload = multer({ storage: storage });

    router.post('/chat/image-message', upload.fields([{ name: 'file', maxCount: undefined }]), homeController.sendImageMessage);
    router.get('/videocall/:friendid', authController.checkingCookie, loggedIn, homeController.getVideoCall);

    router.post('/profile-user/change-avatar', upload.single('mySingleFile'), homeController.changeAvatar); // this is  a route handler with multiple callback functions


    // route for login 


    router.post('/login', authController.login);

    router.post('/sign-up', authController.register);

    router.get('/logout', authController.checkingCookie, loggedIn, authController.logout);

    // authentication with facebook
    router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email', session: false }));
    router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login-form', session: false }), authController.init_RToken_AToken_for_FB_GG);

    // authenticaton with google
    router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'], session: false }));
    router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login-form', session: false }), authController.init_RToken_AToken_for_FB_GG);
    return app.use('/', router)
}


export default initWebRoute;