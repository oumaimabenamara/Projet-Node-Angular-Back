const express = require('express');
const passport = require('passport');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// require event schema
const Event = require('../models/eventSchema')

// Storage
const myStorage = multer.diskStorage({
    destination:  (req, file, cb)=> {
        const folder = path.resolve('./uploads');
        // console.log(folder);
        cb(null, folder)
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const newFileName =  Date.now() + extension;
        cb(null, newFileName);
    }
  });
  
// File filter 
const myFileFilter =  (req, file, cb) => {
    const allowedFileExtentions = ['.jpg', '.jpeg', '.png', '.git'];
    const extension = path.extname(file.originalname);
    cb(null, allowedFileExtentions.includes(extension))
  }
  
// create the multer middleware 
const upload = multer({ storage: myStorage, fileFilter: myFileFilter});

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

router.post('/events', [passport.authenticate('bearer', { session: false }) , upload.single('image') ] , async (req, res) => {
    try{
        if (req.file !== undefined)
        {
          //ADD EVENT PHOTO
          console.log(req.file);
          req.body.companyPhoto = req.file.filename;
        }
        const createdEvent = await Event.create(req.body);
        res.json(createdEvent);
    }
    catch(error)
    {
        res.status(500).json({message:'internal server error'})
    }
});

router.put('/events/:id', [passport.authenticate('bearer', { session: false }), upload.single('image')] ,  async (req, res) => {
    try{
        if (req.file !== undefined)
        {
          //EDIT EVENT PHOTO
          console.log(req.file);
          req.body.companyPhoto = req.file.filename;
        }

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