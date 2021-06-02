const express = require ('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//require company schema   
const Company = require('../models/companySchema');


//register
router.post('/register', async(req,res)=>{
    try{
        const companyFound = await Company.findOne({email: req.body.email});
        if(companyFound == null)
        {
            // hashage de password
            bcrypt.hash(req.body.password, 10, async(error, hash)=>{
                if(error)
                {
                    res.status(500).json({message: 'server error!'});
                }
                //store hash in your password DB.
                req.body.password = hash;
                await Company.create(req.body);
                res.json({message: 'registred successfully!'});
            });
        }else{
        res.status(400).json({message: 'E-mail exist'});
        }
    }
    catch(error)
    {
        res.status(500).json({message:'internal server error'})
    }
});


module.exports = router;