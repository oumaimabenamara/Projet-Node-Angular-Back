const mongoose = require('mongoose');
const tagSchema = mongoose.Schema({
    tagName: String,
    tagDescription: String,
},
    {
        versionKey: false,
        timestamps: true
    });

module.exports = mongoose.model('tags', tagSchema);