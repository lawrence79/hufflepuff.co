// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
    var express    = require('express'),
    app        = express(),
    path		= require('path'),
    express    = require('express'),
    bodyParser = require('body-parser'),
    port 		= process.env.PORT || 8080;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './public')));
app.set('view engine', 'jade');


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


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.get('/', function(req, res) {
  	res.render('index');
});

app.listen(port);
console.log('Started on ' + port);

