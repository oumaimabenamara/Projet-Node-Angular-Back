const mongoose = require('mongoose');
const eventSchema = mongoose.Schema({
    eventName: String,
    eventDescription: String,
    photo: String,
    startDateTime: Date,
    endDateTime: Date,
    location: String,
    numberOfTickets: Number,
    eventType: String,
    price: String,
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tags' }]
},
    {
        versionKey: false,
        timestamps: true
    });

module.exports = mongoose.model('events', eventSchema);