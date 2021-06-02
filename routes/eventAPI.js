const express = require('express');
const passport = require('passport');
const router = express.Router();
// require event schema
const Event = require('../models/eventSchema')

router.get('/events', passport.authenticate('bearer', { session: false }) ,  async (req, res)=>{
    try{
        const events = await Event.find();
        res.json(events);
    }
    catch(error)
    {
        res.status(500).json({message:'internal server error'})
    }
});

router.get('/events/:id', passport.authenticate('bearer', { session: false }), async (req, res) => {
    try{
        const foundEvent = await Event.findById(req.params.id); 
        res.json(foundEvent);
    }
    catch(error)
    {
        res.status(500).json({message:'internal server error'})
    }
});

router.post('/events', passport.authenticate('bearer', { session: false }), async (req, res) => {
    try{
        const createdEvent = await Event.create(req.body);
        res.json(createdEvent);
    }
    catch(error)
    {
        res.status(500).json({message:'internal server error'})
    }
});

router.put('/events/:id', passport.authenticate('bearer', { session: false }),  async (req, res) => {
    try{
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {new : true});
        res.json(updatedEvent);
    }
    catch(error)
    {
        res.status(500).json({message:'internal server error'})
    }
});

router.delete('/events/:id', passport.authenticate('bearer', { session: false }), async (req, res) => {
    try{
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        res.json({message: 'event deleted successfully.'});
    }
    catch(error)
    {
        res.status(500).json({message:'internal server error'})
    }
});

module.exports = router;