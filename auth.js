const Person = require('./models/person'); //to know the username and password
//for authentication
const passport = require("passport"); // used for authentication
const localStrategy = require("passport-local").Strategy; // we will used local stored username and password for authentication
                                                          // different strategies give us option to use gmail or other login options


//middle authentication
//user verification function (configure local strategy)
passport.use(new localStrategy(async (curr_username,curr_password,done) => {
    try{
        const existing_user = await Person.findOne({username : curr_username});
        if(!existing_user)
        {
          //if username is not found
          return done(null,false,{message : "Username not found"});
          //done(err,user,info) fn means the authentication is done
          //based on the paraments of done we know it was successfull or not
        }

        const match_Password = await existing_user.comparePassword(curr_password);
        if(match_Password)
          return done(null,existing_user);
        else
            return done(null,false,{message : "Incorrect Password"});
    }catch(err){
        return done(err);
    }
}));//now choose which routes to authenticate

module.exports = passport;