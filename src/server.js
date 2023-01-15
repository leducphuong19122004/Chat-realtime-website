import express from 'express';
import configViewEngine from './configs/viewEngine';
import initWebRoute from './route/web';
import initAPIRoute from './route/apiRoute';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

require('dotenv').config(); // static file

var app = express();
const port = process.env.PORT || 3000;

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
// The createWriteStream(path, options) method is an inbuilt application programming interface of fs module which allows to quickly make a writable stream 
// for the purpose of writing data to a file. This method may be a smarter option compared to methods like fs.writeFile when it comes to very large amounts of data.

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

// get data from client 
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: false }));

// set up view engine
configViewEngine(app);

// init web route
initWebRoute(app);

// init api route
initAPIRoute(app);

app.use((req, res) => { // Bind application-level middleware to an instance of the app object by using the app.use() 
    res.render('404.ejs');
})

app.listen(port);
console.log('Server is listening on port 3000');