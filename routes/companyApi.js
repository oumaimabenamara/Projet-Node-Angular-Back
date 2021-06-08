const express = require('express');
const router = express.Router();
const passport = require('passport');

//require company schema
const Company = require('../models/companySchema');

// 1. get all companies
router.get('/companies', passport.authenticate('bearer', { session: false }), async(req, res) => {
  try{
    const companies = await Company.find();
    res.json(companies);
  }
    catch(error)
    {
        res.status(500).json({message:'internal server error'})
    }
  });

// 2. get company by id
  router.get('/companies/:id', passport.authenticate('bearer', { session: false }), async(req, res) => {
    try{
      const companyId = await Company.findById(req.params.id);
      res.json(companyId);
    }
    catch(error)
    {
        res.status(500).json({message:'internal server error'})
    }
  });

// 3.add company

   router.post('/companies', passport.authenticate('bearer', { session: false }), async(req, res) => {
     try{
      const createdCompany = await Company.create(req.body);
      res.json(createdCompany);
     }
  catch(error)
  {
      res.status(500).json({message:'internal server error'})
  }
});

//4. update company by id

    router.put('/companies/:id', passport.authenticate('bearer', { session: false }), async(req, res) => {
      try{
        const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(updatedCompany);
      }
    catch(error)
    {
        res.status(500).json({message:'internal server error'})
    }
  });

   //5. delete company by id

   router.delete('/companies/:id', passport.authenticate('bearer', { session: false }), async(req, res) => {
     try{
      const deletedCompany = await Company.findByIdAndDelete(req.params.id);
      res.json({message:'Company deleted successfully'});
     }
    catch(error)
    {
        res.status(500).json({message:'internal server error'})
    }
  });


module.exports = router;
