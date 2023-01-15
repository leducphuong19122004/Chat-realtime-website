import express from 'express';
import APIcontroller from '../controller/APIcontroller';

let router = express.Router();

// This code below will create a router as a module, loads a middleware function in it, defines some routes, and mounts the router module on a path in the main app.
const initAPIRoute = (app) => {
    router.get('/users', APIcontroller.getAPIusers); // mehtod GET -> read data
    router.post('/create-user', APIcontroller.createUser) // method POST -> create data
    router.put('/update-user', APIcontroller.updateUser); // mehtod PUT -> update data
    router.delete('/delete-user/:No', APIcontroller.deleteUser); // method DELETE -> delete data
    return app.use('/api/v1/', router)
}

export default initAPIRoute;