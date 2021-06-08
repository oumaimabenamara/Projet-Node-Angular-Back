const express = require('express');
const router = express.Router();
const passport = require('passport');
const Event = require('../models/eventSchema');
const Tag = require('../models/tagSchema');
const Company = require('../models/companySchema');
const Reservation = require('../models/reservationSchema')



router.get('/dashboard', passport.authenticate('bearer', { session: false }), async (req, res) => {
    const countCompany = await Company.count();
    const countEvent = await Event.count();
    const countTag = await Tag.count();
    const countReservation = await Reservation.count();
    res.json({ countCompany, countEvent, countTag, countReservation })
});
module.exports = router;