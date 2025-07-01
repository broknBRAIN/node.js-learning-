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

app.get('/', (req, res) => {
  res.send('you have getted')
});

app.use("/person",personRouter);
app.use("/menu",menuRouter);

// port number
app.listen(port,() =>{
    console.log("server is at " + port);
});

