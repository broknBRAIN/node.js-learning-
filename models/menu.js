const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    item :{
        type: String,
        required: true,
        unique: true
    },
    taste: {
        type: String,
        enum: ["sweet","sour","spicy"]
    },
    price : {
        type: Number
    }
});

const Menu = mongoose.model('menu',menuSchema);

module.exports = Menu;