var mongoose = require('mongoose');

var ReservationSchema = new mongoose.Schema({
    id: Number,
    rideId: Number
});

module.exports = mongoose.model('Reseration', ReservationSchema);