const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')

//Register Route
router.post('/', async (req,res)=>{
    try{
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password,salt);
    const user = await new User({
        username:req.body.username,
        email:req.body.email,
        password:hashed
    });

    await user.save();
    res.send("Response recieved")
    }catch(err)
    {
        console.log(err)
    }
});


module.exports = router