const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const passport = require('./passport/passport');
const port = 3000;
const app = express();
app.unsubscribe(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//import connection to database
const connect = require('./database/connect');

//import routing
const registerAPI = require('./routes/registerAPI');
const loginAPI = require('./routes/loginAPI');
const companyAPI = require('./routes/companyAPI');


//use routing
app.use('', registerAPI);
app.use('', loginAPI);
app.use('', companyAPI);




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });