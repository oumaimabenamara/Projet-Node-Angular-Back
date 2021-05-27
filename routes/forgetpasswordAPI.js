const express = require("express");
const router = express.Router();
const Company = require("../models/companySchema");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const ejs = require("ejs");

router.get("/forget-password/:email", async (req, res) => {
    const foundCompany = await Company.findOne({ email: req.params.email });
    if (foundCompany == null) {
        res.status(400).json({ message: "Account not found" });
    } else {
        // try 1 (reset token + create link to send)
        /* let token = await Token.findOne({ userId: user._id });
             if (token) {
                 await token.deleteOne()
             };
             let resetToken = crypto.randomBytes(32).toString("hex");
     
             const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
     
             await new Token({
                 userId: user._id,
                 token: hash,
                 createdAt: Date.now(),
             }).save();
     
             const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
             sendEmail(user.email, "Password Reset Request", { name: user.name, link: link, }, "./template/requestResetPassword.handlebars");
             return link;*/

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
        const link = process.env.DASHBOARDURL
        const render = ejs.render(resetPwdTemplate, { name: foundCompany.companyName, link: link });
        console.log(render);

        let info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: foundCompany.email,
            subject: "Reset password",
            html: render,
        });
        // return response
        res.json({ message: "check your mail" });
    }
});

module.exports = router;
