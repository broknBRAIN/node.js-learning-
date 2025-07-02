//version 2
const express = require('express')
const app = express();
const db = require('./db');
const Person = require('./models/person');
const Menu = require('./models/menu');

const personRouter = require("./routes/personRoutes");
const menuRouter = require("./routes/menuRoutes");

const bodyParser = require('body-parser');
app.use(bodyParser.json()); //stored the data in req.body as javaScript object

const port = 3232;

//middleware logging
//middle ware is a which runs between a request -> middleware ->response
//mostly used for logging
const logRequest = (req,res,next) => {
    console.log(` [${new Date().toLocaleString()}] Request made to : ${req.originalUrl} `);
    //prints the time when url is hit
    //logging
    next();
    //after logging just process the next command it had to do(middleware is done)
};

//to use middleware in the whole project
app.use(logRequest);

app.get('/', (req, res) => {
  res.send('you have getted')
});

app.use("/person",personRouter);
app.use("/menu",menuRouter);

// port number
app.listen(port,() =>{
    console.log("server is at " + port);
});

