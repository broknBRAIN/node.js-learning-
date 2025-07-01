const app = require("express");
const router = app.Router();
const Menu = require("./../models/menu");

router.post('/',async (req,res) => {
    try{
        const data = req.body;
        const temp = new Menu(data);
        const response = await temp.save();
        console.log("menu saved");
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal Server Error'});
    }
});

router.get('/',async (req,res) => {
    try{
        const data = await Menu.find();
        console.log("menu fetched");
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal Server Error'});
    }
});

router.get('/:tasteType',async (req,res) => {
    try{
        const type = req.params.tasteType;
        const data = await Menu.find({taste: type});
        console.log("fetched");
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal Server Error'});
    }
});

module.exports = router;