//token based authentication and authorisation

const jwt = require("jsonwebtoken");
const JWT_SECRET = '12345';

//just the way we had localAuthMiddleware
//req,res,next is the template of a middleware function
//we use it because auth is done in middleware
const jwtAuthMiddleware = (req,res,next) => {

    //check if req header has authorization
    const authorization = req.headers.authorization;
    if(!authorization)
        return res.status(401).json({error:"Token Not Found"});
    
    //extract jwt token from req header
    //where is the token
    //its inside the header of req object,under authorisation as Bearer <token>

    const token = req.headers.authorization.split(' ')[1];
    //we used split because authorization is stored as
    //Beared<space>token
    //so put Bearer in split[0]
    //ans token in split[1]

    if(!token)
        return res.status(401).json({error:"Unauthorised"});

    try{
        //verify the token
        const decoded = jwt.verify({token},JWT_SECRET,{expiresIn : 1000});
        //***first parameter has to be in {},has to be an object for timer to work***
        //verity(token,secretKey)

        //we create a new field inside req and put decoded value there to use if needed
        //userPayload does not existed earlier
        req.userPayload = decoded;
        next();

    }catch(err){
        console.log(err);
        res.status(401).json({error:"Invalid Token"});
    }
}

//generate jwt token
//user data is the payload,we require payload to know which user this jwt belongs to
const generateToken = (userData) => {
    return jwt.sign(userData,JWT_SECRET);
}

module.exports = {jwtAuthMiddleware,generateToken};