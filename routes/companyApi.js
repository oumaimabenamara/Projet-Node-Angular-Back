const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
//require company schema
const Company = require('../models/companySchema');

const myStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.resolve('./uploads');
    // console.log(folder);
    cb(null, folder)
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    // console.log(extension);
    const newFileName = Date.now() + extension;
    // console.log(newFileName);
    cb(null, newFileName);
  }
});

// File filter 
const myFileFilter = (req, file, cb) => {
  const allowedFileExtentions = ['.jpg', '.jpeg', '.png', '.git'];
  const extension = path.extname(file.originalname);
  cb(null, allowedFileExtentions.includes(extension))
}

// create the multer middleware 
const upload = multer({ storage: myStorage, fileFilter: myFileFilter });


// 1. get all companies
router.get('/companies', passport.authenticate('bearer', { session: false }), async (req, res) => {
  try {
    console.log(req.user);
    if (req.user.role == 'admin') {
      res.json([req.user]);
    }
    else {
      const companies = await Company.find();
      res.json(companies);
    }
  }
  catch (error) {
    res.status(500).json({ message: 'internal server error' })
  }
});

// 2. get company by id
router.get('/companies/:id', passport.authenticate('bearer', { session: false }), async (req, res) => {
  try {
    const companyId = await Company.findById(req.params.id);
    res.json(companyId);
  }
  catch (error) {
    res.status(500).json({ message: 'internal server error' })
  }
});

// 3.add company

router.post('/companies', [passport.authenticate('bearer', { session: false }), upload.single('image')], async (req, res) => {
  try {
    if (req.file !== undefined) {
      //ADD COMPANY PHOTO
      console.log(req.file);
      req.body.companyPhoto = req.file.filename;
    }

    //HASH PWD
    bcrypt.hash(req.body.password, 10, async (error, hash) => {
      if (error) {
        res.status(500).json({ message: 'internal server error' })
      }
      else {
        req.body.password = hash;
        const createdCompany = await Company.create(req.body);
        res.json(createdCompany);
      }
    });
  }
  catch (error) {
    res.status(500).json({ message: 'internal server error' })
  }
});

//4. update company by id

router.put('/companies/:id', [passport.authenticate('bearer', { session: false }), upload.single('image')], async (req, res) => {
  try {
    if (req.file !== undefined) {
      //EDIT COMPANY PHOTO
      console.log(req.file);
      req.body.companyPhoto = req.file.filename;
    }

    //HASH PWD
    if (req.body.password !== undefined && req.body.password !== null) {
      bcrypt.hash(req.body.password, 10, async (error, hash) => {
        req.body.password = hash;
        // console.log(req.body);
        const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCompany);
      });
    }
    else {
      // console.log(req.body);
      if (req.body.password) {
        delete req.body.password;
      }
      const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedCompany);
    }


  }
  catch (error) {
    res.status(500).json({ message: 'internal server error' })
  }
});

//5. delete company by id

router.delete('/companies/:id', passport.authenticate('bearer', { session: false }), async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    res.json({ message: 'Company deleted successfully' });
  }
  catch (error) {
    res.status(500).json({ message: 'internal server error' })
  }
});


module.exports = router;
