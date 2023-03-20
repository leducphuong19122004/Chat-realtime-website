// View engines allow us to render web pages using template files. These templates are filled with actual data and served to the client.
import express from "express";

function configViewEngine(app) {
    app.use(express.static('./src/public')); // public files in public directory which people can see on client site.
    // app.use('/update-file', express.bodyParser()); // tell to the app i dont want to use bodyparser in the route upload-file
    app.use("/css", express.static("./node_modules/bootstrap/dist/css"));
    app.use("/js", express.static('./node_modules/bootsrap/dist/js'));
    app.use('/client-dist', express.static('./node_modules/socket.io/client-dist'));
    app.set("view engine", "ejs");
    app.set("views", "./src/views");
}

export default configViewEngine;

