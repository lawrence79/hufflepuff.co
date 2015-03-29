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

router.post('/play',function(req, res) {
    res.json(req.body);
    console.log(req.body);
});

var apiController = require('./app/routes/api');

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.post('/sms', apiController.postTwilio);

app.get('/', function(req, res) {
  	res.render('index');
});

server.listen(port);  //listen on port 80
console.log('Started on ' + port);

