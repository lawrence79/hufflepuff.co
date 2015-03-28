var mongoose = require('mongoose');

var ReservationSchema = new mongoose.Schema({
    poiId: Number,
    qty: Number,
    timestamp: Number,
    name: String,
    uid: Number,
    deviceType: String,
    deviceId: Number
});

module.exports = mongoose.model('Reservation', ReservationSchema);
