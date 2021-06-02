const express = require('express');
const router = express.Router();
const Tag = require('../models/tagSchema');
const passport = require('passport');

router.get('/tags', passport.authenticate('bearer', { session: false }), async (req, res) => {
    try{
        const Tags = await Tag.find()//.populate('tutorials');
        res.json(Tags);
    }
    catch(error)
    {
        res.status(500).json({message:'internal server error'})
    }
});

router.get('/tags/:id', passport.authenticate('bearer', { session: false }), async (req, res) => {
    try{
        const foundTag = await Tag.findById(req.params.id);
        res.json(foundTag);
    }
    catch(error)
    {
        res.status(500).json({message:'internal server error'})
    }
});

router.post('/tags', passport.authenticate('bearer', { session: false }), async (req, res) => {
    try{
        const createdTag = await Tag.create(req.body);
        res.json(createdTag);
    }
    catch(error)
    {
        res.status(500).json({message:'internal server error'})
    }
});

router.put('/tags/:id', passport.authenticate('bearer', { session: false }), async (req, res) => {
    try{
        const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTag);
    }
    catch(error)
    {
        res.status(500).json({message:'internal server error'})
    }
});

router.delete('/tags/:id', passport.authenticate('bearer', { session: false }), async (req, res) => {
    try{
        const deletedTag = await Tag.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tag deleted successfully.' });
    }
    catch(error)
    {
        res.status(500).json({message:'internal server error'})
    }
});


module.exports = router;