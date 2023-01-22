import connection from '../configs/connectDB';
import multer from 'multer';
import { readFile } from '@babel/core/lib/gensync-utils/fs';

let getStartPage = async (req, res) => {
    return res.render('startPage.ejs')
}
let getHomePage = async (req, res) => {
    const [rows, fields] = await connection.execute('SELECT * FROM `mydata01`'); // [rows,fields] is destruturing in javascript
    return res.render('index.ejs', { dataUser: rows })
}

let getDetailPage = async (req, res) => {
    let userNo = req.params.No;
    let userInf = await connection.execute('SELECT * FROM `mydata01` WHERE `No` = ? ', [userNo]); // connection.execute() sẽ trả ra hai giá trị nên 
    return res.send(JSON.stringify(userInf[0])) // mình phải dùng userInf[0]
}

let createNewUser = async (req, res) => {
    let newInf = req.body;
    await connection.execute('INSERT INTO mydata01(firstname,lastname,email,password) VALUES (?,?,?,?)', [newInf.fname, newInf.lname, newInf.email, newInf.password]);
    return res.redirect('/') // back to homepage
}

let deleteUser = async (req, res) => {
    let userNo = req.params.No;
    await connection.execute('DELETE FROM mydata01 WHERE `No` = ?', [userNo]);
    return res.redirect('/')
}

let editUserInf = async (req, res) => {
    let userNo = req.params.No;
    const [rows, fields] = await connection.query('SELECT * FROM mydata01 WHERE No = ? ', [userNo]);
    return res.render('update.ejs', { dataUser: rows });
}

let updateInfUser = async (req, res) => {
    let infUser = req.body;
    await connection.execute('UPDATE mydata01 SET firstname = ? , lastname = ? , email = ? , password = ? ', [infUser.fname, infUser.lname, infUser.email, infUser.repeatPW]);
    return res.redirect('/')
}

// upload file
let getUploadFilePage = async (req, res) => {
    return res.render('uploadFile.ejs')
}


// handle upload file
let handleSingleFile = async (req, res, next) => {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any
    if (!req.file) {
        return res.send('Please select an image to upload');
    }
    // Display uploaded image for user validation
    res.send(`You have uploaded this image: <hr/><img src="/fileUpload/${req.file.filename}" width="500"><hr /><a href="http://localhost:3000/upload-file">Upload another image</a>`);
}


let handleMultipleFile = async (req, res) => {
    const files = req.files;
    if (files.length == 0) {
        return res.send('Please select an image to upload');
    }
    let result = "You have uploaded these images: <hr />";
    let index, len;
    // Loop through all the uploaded images and display them on frontend
    for (index = 0, len = files.length; index < len; ++index) {
        result += `<img src="/fileUpload/${files[index].filename}" width="300" style="margin-right: 20px;">`;
    }
    result += '<hr/><a href="http://localhost:3000/upload-file">Upload more images</a>';
    res.send(result);
}

// login form
let getLoginForm = (req, res) => {
    return res.render('login_form.ejs')
}

let getSignupForm = (req, res) => {
    return res.render('signupForm.ejs')
}
module.exports = {
    getStartPage,
    getHomePage,
    getDetailPage,
    createNewUser,
    deleteUser,
    editUserInf,
    updateInfUser,

    //upload file
    getUploadFilePage,
    handleSingleFile,
    handleMultipleFile,
    getLoginForm,
    getSignupForm
}