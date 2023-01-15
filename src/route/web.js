import express from 'express';
import homeController from '../controller/homeController';
import multer from "multer";
import path from 'path';
import { nextTick } from 'process';


let router = express.Router();// Use the express.Router class to create modular, mountable route handlers

// This code below will create a router as a module, loads a middleware function in it, defines some routes, and mounts the router module on a path in the main app.
const initWebRoute = (app) => {
    console.log('init web route is running');
    router.get('/', homeController.getHomePage);
    router.get('/home', homeController.getHomePage);
    router.get('/detail/user/:No', homeController.getDetailPage);
    router.get('/delete-user/:No', homeController.deleteUser);
    router.get('/edit/user/:No', homeController.editUserInf);
    router.post('/create-new-user', homeController.createNewUser);
    router.post('/update-inf-user', homeController.updateInfUser);

    // upload file
    router.get('/upload-file', homeController.getUploadFilePage);

    //cấu hình lưu trữ file khi upload xong
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'D:\\Nodejs\\src\\public\\fileUpload'); // cb is a callback function 
        },
        filename: function (req, file, cb) {
            const filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
            // fieldname is field name specified in the form
            // The path.extname() method returns the extension of the path
            cb(null, filename);
        }
    })

    let upload = multer({ storage: storage, limits: { fileSize: 1000000 } });
    let uploadMultipleFile = upload.array('myMultipleFile', 5);

    router.post('/upload-single-file', upload.single('mySingleFile'), homeController.handleSingleFile); // this is  a route handler with multiple callback functions

    router.post('/upload-multiple-file',
        (req, res, next) => {
            uploadMultipleFile(req, res, (err) => {
                if (err instanceof multer.MulterError && err.code == 'LIMIT_UNEXPECTED_FILE') {
                    return res.send('TOO MANY FILES !!!')
                } else {
                    next(err);
                }
            })
        },
        homeController.handleMultipleFile);

    return app.use('/', router)
}
export default initWebRoute;