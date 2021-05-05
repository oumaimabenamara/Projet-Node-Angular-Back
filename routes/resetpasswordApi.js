const express = require('express');
const router = express.Router();
const Company = require('../models/companySchema');
const passport = require('passport');



router.put('/reset-password/:id', passport.authenticate('bearer', { session: false }), async (req, res) => {
    const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCompany);
});


module.exports = router;