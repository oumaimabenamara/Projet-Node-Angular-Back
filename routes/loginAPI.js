const express = require ('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//require company schema   
const Company = require('../models/companySchema');


//login
router.post('/login', async(req,res)=>{
    const companyFound = await Company.findOne({email: req.body.email});
    if(companyFound == null)
    {
        res.json({message: 'Please verify your email or password!'});
    }
    else{
       const passwordEqual = await bcrypt.compare(req.body.password, companyFound.password);
       if(passwordEqual == true)
       {
           // create a token
           const tokenData = { 
                email: companyFound.email,
                companyId: companyFound._id,
                companyName: companyFound.companyName
        };
           const createdToken = jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
           res.json({message: 'Login successfully', token: createdToken});
       }
       else{
           res.json({message:'Please verify your email or password!'});
       }
    }
 });

 module.exports = router;