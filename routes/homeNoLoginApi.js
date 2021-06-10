const express = require('express');
const router = express.Router();
const Event = require('../models/eventSchema')

router.get('/events-nologin', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ message: 'internal server error' })
    }
});

router.get('/events-nologin/:id', async (req, res) => {
    try {
        const foundEvent = await Event.findById(req.params.id);
        res.json(foundEvent);
    }
    catch (error) {
        res.status(500).json({ message: 'internal server error' })
    }
});

module.exports = router;