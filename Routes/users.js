const router = require('express').Router();

router.get('/',(req,res)=>{
    res.send("User Route hit")
});


module.exports = router