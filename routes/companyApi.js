const express = require('express');
const router = express.Router();
const passport = require('passport');

//require company schema
const Company = require('../models/companySchema');

// 1. get all companies
router.get('/companies', passport.authenticate('bearer', { session: false }), async(req, res) => {
    const companies = await Company.find();
    res.json(companies);
  });

// 2. get company by id
  router.get('/companies/:id', passport.authenticate('bearer', { session: false }), async(req, res) => {
    const companyId = await Company.findById(req.params.id);
    res.json(companyId);
  });

// 3.add company

   router.post('/companies', passport.authenticate('bearer', { session: false }), async(req, res) => {
    const createdCompany = await Company.create(req.body);
  res.json(createdCompany);
});

//4. update company by id

    router.put('/companies/:id', passport.authenticate('bearer', { session: false }), async(req, res) => {
    const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(updatedCompany);
  });

   //5. delete company by id

   router.delete('/companies/:id', passport.authenticate('bearer', { session: false }), async(req, res) => {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    res.json({message:'Company deleted successfully'});
  });


module.exports = router;
