const app = require("express");
const router = app.Router();
const Person = require("./../models/person");
const {jwtAuthMiddleware,generateToken} = require("./../jwt");

//this creates a new person
//that means signup
router.post('/signup', async (req,res) => {

    // const data = req.body;

    // //create a document(or row in sql)
    // const tempPerson = new Person(data); //person already imported

    // //now copy the data into the schema or body created
    // // tempPerson.name = data.name;
    // // tempPerson.age = data.age;
    // // tempPerson.work = data.work;

    // //enter in the database
    // tempPerson.save((error,savedPerson) => {
    //     if(error)
    //     {
    //         console.log("error occured : ",error);
    //         res.status(500).json({error: 'Internal Server Error'});
    //     }
    //     else
    //     {
    //         console.log("data saved successfully");
    //         res.status(200).json(savedPerson);
    //     }
    // })

    try{
        const data = req.body;

        //create a document(or row in sql)
        const tempPerson = new Person(data); //person already imported

        //enter in the database
        const response = await tempPerson.save();
        console.log("data saved");

        //creating paylod
        const payload = {
            id: response.id,//the mongo db id of the document
            username :response.username
        }

        const token = generateToken(payload);
        console.log("token is " + token);
        
        //only returns the new updated user
        //we need to send the token so we can identify in future
        res.status(200).json({response: response,token :token});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

//when the token is expired
router.post('/login', async (req,res) => {
    try{
        //extract username and password from req
        const {username,password} = req.body;

        //find the user in db
        const user = await Person.findOne({username: username});

        //if no user exists or wrong password
        if(!user || !user.comparePassword(password))
            return res.status(401).json({error : 'Invalid username or password'});

        //generate token
        const payload = {
            id : user.id,
            username : user.username
        }
        const token = generateToken(payload);

        res.json({token});

    }catch(err){
        console.log(err);
        res.status(500).json({error : "Internal Server Error"});
    }
});

//profile
//using the id stored in the token
router.get('/profile',jwtAuthMiddleware,async (req,res) => {
    try{
        const user = req.userPayload;
        //this user will have the payload info of the token
        //as in jwt.js you inserted token in userPayload
        const id = user.id; //extract the mongodb id, as token is made from that, and must contain it

        const data = await Person.findById(id);

        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({error : "Internal Server Error"});
    }
});

router.get('/', jwtAuthMiddleware,async (req,res) => {
    try{
        const data = await Person.find();
        console.log("data fetched");
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.put('/:id', async (req,res) => {
    try{
        const id = req.params.id;   //id of the record that mongodb gives(unique id)
        const updateData = req.body;

        const response = await Person.findByIdAndUpdate(id,updateData,{
            new: true,              //return the updated document
            runValidators: true     //run the validations checks (ex. work is strudent and job only according to schema)
        });

        //if the id is not found
        //resoponse becomes null
        if(!response)
        {
            return res.status(404).json({message: 'id not found'});
        }

        console.log("record updated");
        res.status(200).json(response);

    }catch{err}{
        console.log(err);
        res.status(500).json({error : "Internal database failure"});
    }
});

router.delete("/:id", async (req,res) => {
    try{
        const id = req.params.id;

        const response = await Person.findByIdAndDelete(id);

        if(!response)
            {
                return res.status(404).json({message: 'id not found'});
            }
    
        console.log("record deleted");
        res.status(200).json({message : "Record is deleted"});
    }catch(err){
        console.log(err);
        res.status(500).json({error : "Internal database failure"});
    }
});

module.exports = router;