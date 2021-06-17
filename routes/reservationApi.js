const express = require('express');
const app = express();
const router = express.Router();
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const pdf = require("pdf-creator-node");
const QRCode = require('qrcode');
const UserInfo = require("../models/reservationSchema");
const Event = require("../models/eventSchema");

router.post('/reservation/:eventID', async (req, res) => {
    try {
        const eventDetails = await Event.findById(req.params.eventID);
        if (eventDetails.numberOfTickets > 0) {
            const userReservationInfo = await UserInfo.create(req.body);
            // console.log(userReservationInfo);

            // qrcode generation
            const qrCodePath = `http://localhost:3000/qrcodes/${userReservationInfo._id}.png`
            await QRCode.toFile(path.resolve(`./qrcodes/${userReservationInfo._id}.png`), JSON.stringify(userReservationInfo))
            // await QRCode.toFile(path.resolve(qrCodePath), JSON.stringify(userReservationInfo))
            // let base64Image = $('#qr_code img').attr('src');
            // CREATE PDF
            const options = {
                format: "A4",
                orientation: "portrait",
                border: "10mm",
                header: {
                    height: "45mm",
                    contents: '<div style="text-align: center;">Author: Bechir</div>'
                },
                footer: {
                    height: "28mm",
                    contents: {
                        first: 'Cover page',
                        2: 'Second page', // Any page number is working. 1-based index
                        default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                        last: 'Last Page'
                    }
                }
            };

            const pdfTemplatePath = path.resolve(
                "./pdfTemplate",
                "eventPdfTemplate.html"
            );

            const pdfTemplate = fs.readFileSync(pdfTemplatePath, {
                encoding: "utf-8",
            });


            // const renderPDF = ejs.render(pdfTemplate, { firstName: userReservationInfo.firstName, lastName: userReservationInfo.lastName, reservationDate: userReservationInfo.createdAt, qrCodePath: userReservationInfo._id });
            const ticketDate = `${userReservationInfo.createdAt.getDate()} / ${userReservationInfo.createdAt.getMonth()} / ${userReservationInfo.createdAt.getFullYear()}`;
            const renderPDF = ejs.render(pdfTemplate, { firstName: userReservationInfo.firstName, lastName: userReservationInfo.lastName, reservationDate: ticketDate, qrCodePath: qrCodePath });
            const document = {
                html: renderPDF,
                data: userReservationInfo,
                path: `./${userReservationInfo.firstName}${userReservationInfo.lastName}.pdf`,
                type: "",
            };
            // console.log(renderPDF);



            pdf.create(document, options)
                .then(async (response) => {
                    // console.log(res);
                    // SEND EMAIL 
                    let transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.PASSWORD,
                        },
                    });

                    const reservationTicketTemplatePath = path.resolve(
                        "./mailTemplate",
                        "reservationTicket.html"
                    );

                    const reservationTicketTemplate = fs.readFileSync(reservationTicketTemplatePath, {
                        encoding: "utf-8",
                    });

                    const render = ejs.render(reservationTicketTemplate, { firstName: req.body.firstName, lastName: req.body.lastName });
                    // console.log(render);

                    // SEND EMAIL
                    let info = await transporter.sendMail({
                        from: process.env.EMAIL,
                        to: req.body.email,
                        subject: "Virtual Ticket",
                        html: render,
                        attachments: {
                            filename: 'reservation.pdf',
                            content: fs.createReadStream(response.filename),
                        }
                    });
                    //  
                    await Event.findByIdAndUpdate(req.params.eventID, { $inc: { 'numberOfTickets': -1 } }, { new: true })
                    // return response
                    res.json({ message: "check your mail" });
                })
                .catch((error) => {
                    console.error(error);
                });

        }
        else {
            res.status(400).json({ message: 'No more tickets available' });
        }
    }
    catch (error) {
        
        res.status(500).json({ message: 'internal server error' })
    }
});
module.exports = router;
















