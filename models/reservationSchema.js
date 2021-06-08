const mongoose = require('mongoose');
const reservationSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
},
    {
        versionKey: false,
        timestamps: true
    });

module.exports = mongoose.model('reservation', reservationSchema);