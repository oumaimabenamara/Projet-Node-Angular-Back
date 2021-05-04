const express = require('express');
const router = express.Router();
const Company = require('../models/companySchema');
const passport = require('passport');



router.get('/forget-password/:email', passport.authenticate('bearer', { session: false }), async (req, res) => {
    const foundCompany = await Company.findOne({ email: req.params.email });
    res.json(foundCompany);
});



module.exports = router;