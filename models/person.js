const mongose = require('mongoose');

//schema for the body
const personSchema = new mongose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number
    },
    work:{
        type: String,
        enum: ['student','worker'],
        required: true
    }
});

//now create the model of the schema created
const Person = mongose.model('person',personSchema);

//now export it
module.exports = Person;