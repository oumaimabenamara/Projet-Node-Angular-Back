const mongoose = require('mongoose');
const eventSchema = mongoose.Schema({
    eventName: String,
    eventDescription: String,
    eventPhoto: String,
    // startDate: Date,
    // endDate: Date,
    // startTime: String,
    // endTime: String,
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