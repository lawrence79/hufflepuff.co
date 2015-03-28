var keys = require('../../config/keys');
var twilio = require('twilio')(keys.twilio.sid, keys.twilio.token);

/**
 * POST /api/twilio
 * Send a text message using Twilio.
 */
exports.postTwilio = function(req, res, next) {
    twillio.messages.create({
        to: "9736108383",
        from: "+12017713964",
        body: "Hello",
    }, function(err, message) {
        console.log(message.sid);
    });
};
