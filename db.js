const mongoose = require("mongoose");

//url of mongodb
//port where our mongodb server exists
const mongoURL = 'mongodb://localhost:27017/hotels';

//connect (establish connection of node server with mongodb server)
mongoose.connect(mongoURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//object through which the servers are connected
const db = mongoose.connection;

//even listners
// type-on, connected,error,disconnected

db.on('connected',()=>{
    console.log("server is connected");
})


//export to server of nodejs
module.exports = db;