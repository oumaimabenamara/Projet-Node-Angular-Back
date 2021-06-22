const express = require('express');
const router = express.Router();
const Token = require('../models/resetTokenSchema');
const Company = require('../models/companySchema');
const passport = require('passport');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');



router.post('/reset-password', async (req, res) => {
    try {
        // console.log(req.body);
        const tokenFound = await Token.findOne({ token: req.body.token });
        if (tokenFound == null) {
            res.status(400).json({ message: 'token expired or already used' });
        }
        else {
            const companyFound = await Company.findById(tokenFound.companyId);
            // update PWD
            bcrypt.hash(req.body.newPassword, 10, async (error, hash) => {
                if (error) {
                    res.status(500).json({ message: 'server error' })
                }
                await Company.findByIdAndUpdate(companyFound._id, { password: hash }, { new: true });
                res.json({ message: 'password updated successfully!' });
            });
            // delete token
            await tokenFound.delete();
            // return response
            res.json({ message: 'updatedCompany' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'internal server error' })
        console.log(error);
    }
});


module.exports = router;