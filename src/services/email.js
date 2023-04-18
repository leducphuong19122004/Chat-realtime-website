import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import ejs from 'ejs';
import util from 'util';
import bcrypt from 'bcrypt';
import User from '../configs/regisUser.js';
dotenv.config();
import * as redis from 'redis'; // Dòng này đc thêm vào để fix lỗi TypeError: Cannot read properties of undefined (reading 'createClient')
import { error } from 'console';
import { triggerAsyncId } from 'async_hooks';

const client = redis.createClient({
  host: process.env.REDISHOST,
  port: process.env.REDISPORT,
  password: process.env.REDISPASSWORD,
  url: process.env.REDIS_URL,
  legacyMode: true
}); //Thêm lagacyMode để tránh bug là ClientClosedError: The client is closed

client
  .connect()
  .catch((err) => {
    console.log('err happened' + err);
  });
let emailTemplate = fs.readFileSync(process.env.EMAIL_TEMPLATE_PATH, 'utf-8'); // Read your EJS template file: Use the fs module to read your EJS template file.
let compiledTemplate = ejs.compile(emailTemplate); // Compile your EJS template: Use the compile method of the EJS module to compile your template.

export let sendEmailVerify = async (email, token, userID) => {
  try {
    let variable = {
      userID: userID,
      token: token
    };
    let emailTemplate = compiledTemplate(variable);

    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    })

    const message = {
      from: 'Chat app realtime <process.env.MAIL_FROM_ADDRESS>',
      to: email,
      subject: "Verify email",
      text: "Welcome to chat app realtime ! Please click this link to verify your email https://chat-app-realtime.up.railway.app/verify/" + userID + token,
      html: emailTemplate
    }

    transporter.sendMail(message).then((info) => {
    })
      .catch(error => {
        console.log("error send email :", error);
      })
  }
  catch (error) {
    console.log("error send email :", error)
  }
}

export let verifyEmail = async (req, res) => {
  try {
    const token = req.params.token; // token is hasPassword should be saved in database
    const new_token = token.replaceAll('~', '/');
    const userID = req.params.userID;

    const hgetAsync = util.promisify(client.hGet).bind(client);
    const string_new_user = await hgetAsync('new_user', userID);
    await client.hDel('new_user', userID);

    const new_user = JSON.parse(string_new_user);

    const validPass = await bcrypt.compare(new_user.password, new_token); // new_user.password is raw password
    if (!validPass) {
      return res.status(400).send("Please verify your email again !");
    } else {
      // Create an user object
      const user = new User({
        mobile: new_user.mobile,
        email: new_user.email,
        name: new_user.name,
        password: new_token,
        userID: userID,
      });
      // Save User in the database

      const id = await User.create(user);
      if (id == 1) {
        return res.send("email or mobile number existed");
      }
      res.status(400).redirect('/login-form');
    }
  }
  catch (err) {
    res.status(500).send(err);
    console.log("error in create user");
  }


}



