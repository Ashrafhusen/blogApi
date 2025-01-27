const router = require('express').Router();

const User = require('../models/User.js');

const bcrypt = require('bcrypt');



router.post("/register" , async(req , res) => {
    try {
        const  {userName  , email , password } = req.body

        const salt = await bcrypt.genSalt(10);
        const hassPass = await bcrypt.hash(password , salt);
        const newUser = new User({
            userName, 
            email, 
            password : hassPass,
    }) ;
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) { 
        res.status(500).json(err);
        
    }
})


router.post('/login' , async (req , res ) => {
    try {
        const user = await User.findOne({
            userName : req.body.userName
        })
        if(!user) {
             return res.status(400).json({msg : "Wronf Credentials"});
    }
        const validated= await bcrypt.compare(req.body.password , user.password
        )
        if(!validated) { return res.status(400).json({msg : "Wronf Credentials"});
        }

        const {password , ...others} = user._doc;
        res.status(200).json(others);
        
    } catch (err) {
        res.status(500).json({msg : "Error"})
        
    }
})
module.exports = router;