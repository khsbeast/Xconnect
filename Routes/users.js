const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const { findByIdAndDelete } = require('../models/User');
//update user
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.user.isAdmin) {
        //changing password
        try {
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
        } catch (err) {
            res.status(500).json(err)
        }
        //updating user
        try {
            await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            });
            res.status(200).json("User updated")
        } catch (err) {
            res.status(500).json(err)
        }
    }
    else {
        res.status(403).json("You cannot access other account")
    }
})
//delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.send("User Deleted")
        } catch (err) {
            res.status(500).json(err)
        }
    }
    else {
        res.status(403).json("You cannot access other account")
    }
})
//get a user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, updatedAt, ...other } = user._doc
        if (user)
            res.json(other)
        else
            res.json("User not found")
    } catch (err) {
        res.status(500).json(err)
    }
})
//follow a user
router.post("/:id/follow",async (req,res) =>{
    if(req.body.userId !== req.params.id)
    {
        try{
        const user = await User.findById(req.params.id)
        const currentuser = await User.findById(req.body.userId)
        if(!user.followers.includes(req.body.userId))
        {
            await user.updateOne({ $push:{followers : req.body.userId} });
            await currentuser.updateOne({$push: {following : req.params.id}})
            res.status(200).json("User Followed")
        }
        else
        {
            res.status(404).json("You are already following that user")
        }
    }catch(err)
    {
        res.status(500).json(err)
    }
    }
    else{
        res.status(400).json("You cannot follow yourself")
    }
})
//unfollow a user

router.put("/:id/unfollow",async (req,res) =>{
    if(req.body.userId !== req.params.id)
    {
        try{
        const user = await User.findById(req.params.id)
        const currentuser = await User.findById(req.body.userId)
        if(user.followers.includes(req.body.userId))
        {
            await user.updateOne({ $pull:{followers : req.body.userId} });
            await currentuser.updateOne({$pull: {following : req.params.id}})
            res.status(200).json("User Unfollowed")
        }
        else
        {
            res.status(404).json("You are not following the user")
        }
    }catch(err)
    {
        res.status(500).json(err)
    }
    }
    else{
        res.status(400).json("You cannot unfollow yourself")
    }
})
module.exports = router;