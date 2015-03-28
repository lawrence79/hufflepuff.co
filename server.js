// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var port = process.env.PORT || 8080;        // set our port

mongoose.connect('mongodb://harry:harry@ds061208.mongolab.com:61208/hufflepuff');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('DB Successfully connected');
});

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'jade');

// Models
var Reservation = require('./app/models/reservation');

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();          // get an instance of the express Router

router.use(function(req, res, next) {
    console.log('in the middle');
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'success!' });
});

router.route('/reservations')
    
    // create a reservation (accessed at POST http://localhost:8080/api/reservations)
    .post(function(req, res) {

        var reservation = new Reservation();

        //@todo: update when we have full schema
        reservation.rideId = req.body.rideId;

        reservation.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'Reservation created!'});
        });
    })

    // get all reservations for all rides (accessed at GET http://localhost:8080/api/reservations)
    .get(function(req, res) {
        Reservation.find(function(err, reservations) {
            if (err)
                res.send(err);

            res.json(reservations);
        });
    });


// on routes that end in /reservations/:reservation_id
router.route('/reservations/:reservation_id')
    
    // get the reservation with that id (accessed at GET http://localhost:8080/api/reservations/:reservation_id)
    .get(function(req, res) {
        Reservation.findById(req.params.reservation_id, function(err, reservation) {
            if (err)
                res.send(err);
            res.json(reservation);
        });
    })

    // delete the reservation with this id (accessed at DELETE http://localhost:8080/api/reservations/:reservation_id)
    .delete(function(req, res) {
        Reservation.remove({
            _id: req.params.reservation_id
        }, function(err, reservation) {
            if (err)
                res.send(err);
            res.json({ message: 'Reservation successfully deleted' });
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.get('/', function(req, res){
  res.render('index');
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Started on ' + port);

