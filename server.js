/*dependencies*/
//test
var express = require('express');

var request = require('request');
var bodyParser = require('body-parser');
var log4js = require('log4js');
var mongo = require('mongodb');

var shapeModule = require('./shape');

var ObjectId = mongo.ObjectID;
var app = express();

/*constants*/
var PORT = 3333;

log4js.configure({
  appenders: [{
    type: 'console'
  }]
});

var logger = log4js.getLogger("shapeLogger");

app.use(bodyParser.urlencoded(
    { 
        extended: true  
    }
));
/*app.use(expressLayout);*/
app.use('/public', express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    res.render('index', {});
});

app.use(bodyParser.json());

/*API*/
app.get('/shape/getShapes', shapeModule.getShapes);
app.post('/shape/add', shapeModule.addShape);
app.get('/shape/upadte/:id/:selected', shapeModule.updateStatus);
app.get('/shape/delete/:id', shapeModule.deleteShape);

/*start the server*/
var server = app.listen(PORT, function () {
    var _host = server.address().address;
    var _port = server.address().port;

    logger.info("shapes app's server listening at http://%s%s", _host, _port);
});