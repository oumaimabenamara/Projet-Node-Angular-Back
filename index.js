const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const passport = require('./passport/passport');
const port = 3000;
const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/qrcodes', express.static(path.join(__dirname, 'qrcodes')))
//import connection to database
const connect = require('./database/connect');

//import routing
const registerAPI = require('./routes/registerAPI');
const loginAPI = require('./routes/loginAPI');
const logoutAPI = require('./routes/logoutAPI');
const forgetpasswordAPI = require('./routes/forgetpasswordAPI');
const resetpasswordApi = require('./routes/resetpasswordApi');
const eventAPI = require('./routes/eventAPI');
const companyAPI = require('./routes/companyAPI');
const tagApi = require('./routes/tagApi');
const dashboardApi = require('./routes/dashboardApi');
const reservationApi = require('./routes/reservationApi');
const homeNoLoginApi = require('./routes/homeNoLoginApi');

//use routing
app.use('', registerAPI);
app.use('', loginAPI);
app.use('', logoutAPI);
app.use('', forgetpasswordAPI);
app.use('', resetpasswordApi);
app.use('', eventAPI);
app.use('', companyAPI);
app.use('', tagApi);
app.use('', dashboardApi);
app.use('', reservationApi);
app.use('', homeNoLoginApi);




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});