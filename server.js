// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var http = require('http'),
    path		= require('path'),
    express    = require('express'),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),
    port 		= process.env.PORT || 8080;

var app = module.exports.app = express();


var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance


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
app.use(express.static(path.join(__dirname, './public')));

app.set('view engine', 'jade');

// Models
var Reservation = require('./app/models/reservation');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();          // get an instance of the express Router

router.use(function(req, res, next) {
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'success!' });
});

router.route('/reservations')

    // create a reservation (accessed at POST http://localhost:8080/api/reservations)
    .post(function(req, res) {

        var reservation = new Reservation();

        reservation.poiId = req.body.poiId;
        reservation.qty = req.body.qty;
        reservation.name = req.body.name;
        reservation.timestamp = req.body.timestamp;
        reservation.uid = req.body.uid;
        reservation.deviceType = req.body.deviceType;
        reservation.deviceId = req.body.deviceId || 0;

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

// on routes that end in /reservations/rides/:ride_id
router.route('/reservations/rides/:ride_id')

    // get the reservation with that id (accessed at GET http://localhost:8080/api/reservations/:reservation_id)
    .get(function(req, res) {
        Reservation.find()
            .where('rideId').equals(req.params.ride_id)
            .exec(function(err, reservation) {

            if (err)
                res.send(err);
            res.json(reservation);
        });
    });

var apiController = require('./app/routes/api');
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);
app.get('/sms', apiController.getTwilio);
app.post('/sms', apiController.postTwilio);
app.get('/', function(req, res) {
  	res.render('index');
});

server.listen(port);  //listen on port 80
console.log('Started on ' + port);

