const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')

//Register Route
router.post('/register', async (req,res)=>{
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
        res.status(500).json(err)
    }
});
//login Route(
router.post('/login',async (req,res) => {
    try{
    const user = await User.findOne({email : req.body.email});
    !user && res.status(404).json("Not found")

    const password = await bcrypt.compare(req.body.password,user.password);
    console.log(password)
    !password && res.status(400).json("Wrong Password")

    res.json(user)
    }catch(err)
    {
        res.status(500).json(err)
    } 
})

module.exports = router