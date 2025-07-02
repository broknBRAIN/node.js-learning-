const mongose = require('mongoose');
const bcrypt = require('bcrypt');   //password salt hashing

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
    },
    //for authentication
    username:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//pre is a middleware function
//that mongoose provides
//it always runs before saving the data thats why called pre
personSchema.pre('save', async function (next) {

    //next is a callback fn
    //which we run when we are done, and we want to move forward with 1st argument, here it is save

    const person = this;

    //in case of update
    //check if password is updated or not
    if(!person.isModified('password'))
        return next();
    try{
        //generate salt
        const salt = await bcrypt.genSalt(5);

        //generate password
        const hashcode = await bcrypt.hash(person.password,salt);//arguments are password,salt

        person.password = hashcode;

        next();
    }catch(err){
        return next(err);
    }
})

//function to compare the password provided, with the original password
//we call the person himself to check it for us
//that's why we make it inside the schema
personSchema.methods.comparePassword = async function (tempPass) {
    try{
        const isMatch = await bcrypt.compare(tempPass,this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}

//now create the model of the schema created
const Person = mongose.model('person',personSchema);

//now export it
module.exports = Person;