const app = require("express");
const router = app.Router();
const Person = require("./../models/person");

router.post('/', async (req,res) => {

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
        res.status(200).json(response);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

//to get all the data
router.get('/', async (req,res) => {
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