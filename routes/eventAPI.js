const express = require('express');
const passport = require('passport');
const router = express.Router();
// require event schema
const Event = require('../models/eventSchema')

router.get('/events', passport.authenticate('bearer', { session: false }) ,  async (req, res)=>{
    const events = await Event.find();
    res.json(events);
});

router.get('/events/:id', passport.authenticate('bearer', { session: false }), async (req, res) => {
    const foundEvent = await Event.findById(req.params.id); 
    res.json(foundEvent);
});

router.post('/events', passport.authenticate('bearer', { session: false }), async (req, res) => {
    const createdEvent = await Event.create(req.body);
    res.json(createdEvent);
});

router.put('/events/:id', passport.authenticate('bearer', { session: false }),  async (req, res) => {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {new : true});
    res.json(updatedEvent);
});

router.delete('/events/:id', passport.authenticate('bearer', { session: false }), async (req, res) => {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    res.json({message: 'event deleted successfully.'});
});

module.exports = router;