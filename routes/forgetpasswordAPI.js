const express = require("express");
const router = express.Router();
const Company = require("../models/companySchema");
const Token = require("../models/resetTokenSchema");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const randomString = require("randomstring");
const ejs = require("ejs");

router.get("/forget-password/:email", async (req, res) => {
    try {
        const foundCompany = await Company.findOne({ email: req.params.email });
        if (foundCompany == null) {
            res.status(400).json({ message: "Account not found" });
        } else {
            // try 1 (reset token + create link to send)
            let token = await Token.findOne({ companyId: foundCompany._id });
            if (token) {
                await token.deleteOne()
            };

            const hash = randomString.generate({
                length: 12,
                charset: 'alphabetic'
            });

            const createdToken = await new Token({
                companyId: foundCompany._id,
                token: hash,
                createdAt: Date.now(),
            }).save();


            // send mail
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD,
                },
            });
            const resetPwdTemplatePath = path.resolve(
                "./mailTemplate",
                "resetPwdEmail.html"
            );
            const resetPwdTemplate = fs.readFileSync(resetPwdTemplatePath, {
                encoding: "utf-8",
            });
            const link = `${process.env.DASHBOARDURL}${createdToken.token}`
            const render = ejs.render(resetPwdTemplate, { name: foundCompany.companyName, link: link });
            // console.log(render);

            let info = await transporter.sendMail({
                from: process.env.EMAIL,
                to: foundCompany.email,
                subject: "Reset password",
                html: render,

            });

            // return response
            res.json({ message: "check your mail" });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'internal server error' })
    }
});

module.exports = router;
