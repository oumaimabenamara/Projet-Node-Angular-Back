const mongoose = require('mongoose');
const companySchema = mongoose.Schema({
    companyName: String,
    companyDescription: String,
    photo: String,
    email: String,
    password: String,
    role: {type: String, default: 'admin', required: false},
    events: [{type: mongoose.Schema.Types.ObjectId, ref: 'events'}]
},
{
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('company', companySchema);