const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const Company = require('../models/companySchema');
const jwt = require('jsonwebtoken');


passport.use(new BearerStrategy(
    (token, done) =>{
      try{
        // console.log(token);
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decodedData);
        Company.findById(decodedData.companyId, (err, user)=> {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          return done(null, user, { scope: 'all' });
        });
      }
      catch(error){
        return done(null, false);
      }
    }
  ));