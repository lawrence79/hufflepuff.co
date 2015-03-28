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

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'jade');

// Models
var User = require('./app/models/user');

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

