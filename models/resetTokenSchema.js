const mongoose = require('mongoose');

const resetTokenSchema = mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "company",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,// this is the expiry time in seconds
    },

});


module.exports = mongoose.model('resetToken', resetTokenSchema);