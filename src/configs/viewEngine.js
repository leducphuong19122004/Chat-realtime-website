// View engines allow us to render web pages using template files. These templates are filled with actual data and served to the client.
import express from "express";

function configViewEngine(app) {
    app.use(express.static('./src/public')); // public files in public directory which people can see on client site.
    // app.use('/update-file', express.bodyParser()); // tell to the app i dont want to use bodyparser in the route upload-file

    app.set("view engine", "ejs");
    app.set("views", "./src/views");
}

export default configViewEngine;