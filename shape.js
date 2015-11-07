var mongo = require('./mongo');
var ObjectId = mongo.getMongoObjectId();


exports.addShape = function(req, res) {
    console.log("check:" + JSON.stringify(req.body));

    var shapeSample = {
        "shapeType" : req.body.shapeType,
        "shapePosition" : [
            parseInt(req.body.xCoord),
            parseInt(req.body.yCoord)
        ],
        "shapeSize" :  parseInt(req.body.shapeSize),
        "selected" : false
    };

    console.log(shapeSample);

    // Get the documents collection
    var collection = mongo.getDB().collection('shape');
	
	if(collection) {
    // Insert some documents
    collection.insert(shapeSample, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });

        res.status(200).jsonp({'item' : shapeSample , 'success': true});
	}else {
        res.jsonp({'msg' : 'db error', 'success' : false});
    }
};

exports.getShapes = function(req, res) {
    // Get the documents collection
    var collection = mongo.getDB().collection('shape');

    if (collection) {
        //get all users's documents and render the userDisplay page with the shapes' docs array
        collection.find().toArray(function (err, items) {
            if (err) {
                res.jsonp({'msg': 'db error', 'success': false});
            }
            res.status(200).jsonp({'items': items , 'success': true});
        });
    }
    else {
        res.jsonp({'msg' : 'db error', 'success' : false});
    }
};

exports.updateStatus = function(req, res) {
    var id = req.params.id;
    var selected = req.params.selected;

    var collection = mongo.getDB().collection('shape');
    // Update document where id is object id, set selected
	if (collection) {
		collection.updateOne({ _id : new ObjectId(id) }
        , { $set: { selected : Boolean(selected) }} , {upsert:false}, function (err, result) {
            if (err)
            {
                console.log('Error updating selected of shape : ' + err);
                res.send({'error':'An error has occurred'});
            }
            else
            {
                console.log('' + result + ' document(s) updated');
                res.status(200).jsonp({'msg' : 'db update selected succeed', 'success' : true});
            }

        });
	} else {
        res.jsonp({'msg' : 'db error', 'success' : false});
    }
};

exports.deleteShape = function (req, res) {
    var id = req.params.id;
    console.log('Deleting shape: ' + id);

    var collection = mongo.getDB().collection('shape');
    collection.remove({"_id": new ObjectId(id)}, {safe:true}, function (err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.status(200).jsonp({'msg':'deletion succeed', 'success' : true});
            }
        });
};