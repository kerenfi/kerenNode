
/*create a database with mongoDb server - db name : "shapes"
  create 1 collections - Shapes*/

var mongo = require('mongodb');
var ObjectId = mongo.ObjectID;

//var mongoose = require('mongoose');
//if you work in the cloud you should use the following
//var port = (process.env.VMC_APP_PORT || 3000);
//var host = (process.env.VCAP_APP_HOST || 'localhost');

if(process.env.VCAP_SERVICES){
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var mongo = env['mongodb-1.8'][0]['credentials'];
}
else{
  var mongo = {
    "hostname":"localhost",
    "port":27017,
    "username":"",
    "password":"", 
    "name":"",
    "db":"Shapes"
  }
}

var generate_mongo_url = function(obj){
  obj.hostname = (obj.hostname || 'localhost');
  obj.port = (obj.port || 27017);
  obj.db = (obj.db || 'test');

  if(obj.username && obj.password){
    return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
  else{
    return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
}

var mongourl = generate_mongo_url(mongo);

var db = null;

require('mongodb').connect(mongourl, function (err, conn){

	db =conn;
    if(!err) {
        console.log("Connected to 'shape' database");
        db.collection('shape', {strict:true}, function (err, collection) {
            if (err) {
                console.log(err);
                console.log("The 'shape' collection doesn't exist. Creating it with sample data...");
             //   populateShapeDB();
            }
        });
    }
    //populateUsersDB(); 
});

exports.getDB = function(){
	return db;
};

exports.getMongoObjectId = function(){
	return ObjectId;
};

