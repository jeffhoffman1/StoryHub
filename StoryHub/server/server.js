var express = require('express');
var app = express();
var passport = require('passport');
/** configure server **/
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

/** load up **/

var path = require('path');
var __dir = "/home/ec2-user/StoryHub/StoryHub/";

var MONGOHQ_URL="mongodb://jeffhoffman1:a1234567@dharma.mongohq.com:10061/storyhub";
var test, mongoose, _;


app.post('/login', passport.authenticate('local', 
	{ successRedirect: '/',
      failureRedirect: '/login' }));

	  
/** defining the database **/

mongoose = require("mongoose");
var Schema = mongoose.Schema;

var StorySchema = new Schema({
	StoryID	: String,
	UserID	: String,
	Genre	: String,
	Title	: String,
	Image	: String,
	Options	: {Something : String},
	Upvotes : Number,
	Downvotes : Number	
});

var RevisionSchema = new Schema({
	RevisionID : {type: String, default : "1"},
	UserID	: {type: String, default : "1"},
	StoryID : {type: String, default : "1"},
	Type	: {type: String, default : "1"},
	RevisionBranchID : {type: String, default : "1"},
	Text	: {type: String, default : "1"},
	Upvotes	: {type: Number, default : "1"},
	Downvotes : {type: Number, default : "1"}
});

var RevisionBranchSchema = new Schema({
	RevisionBranchID : String,
	RevisionIDs	: [],
	UserID		: String,
	OriginalRevisionID	: String,
	VoteWeight	: String
});

var VoteSchema = new Schema({
	VoteID	: String,
	UserID	: String,
	RevisionID	: String,
	Vote	: String
});

var RatingSchema = new Schema({
	StoryID	: String,
	UuserID	: String,
	Stars	: Number
});

_ = require("underscore");
var mongodb = require('mongodb');
 
 //mongo dharma.mongohq.com:10061/storyhub -u jeffhoffman1 -p a1234567
 
mongoose.connect(MONGOHQ_URL, function(err){
	throw err;}
);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
});

function save(obj,name){
	var schema = name + "Schema";
	var model = mongoose.model(name,schema);
	var object = new model(obj);
	object.save();
	return object;
}

function findwhere(name,where){
	var schema = name + "Schema";
	var model = mongoose.model(name,schema);
	return model.find(where);
}

function find(name){
	var schema = name + "Schema";
	var model = mongoose.model(name,schema);
	return model.find(function(err,docs){
		if(err){
			return err;
		}
		return docs;
	});
}
/**defining connections**/

app.enable('trust proxy');
app.use('/', express.static('../pages'))
app.use('/', express.static('..'));
app.use('/', express.static('../bootstrap'));

app.get('/hello.txt', function(req, res){
	res.send("Hello World");
});

app.get('/save',function(req,res){
	var obj = req.body.obj;
	var name = req.body.name;
	var ret = save(obj,name);
	res.send(ret);
});

app.get('/findwhere',function(req,res){
	var name = req.body.name;
	var where = req.body.where
	var ret = findwhere(name,where);
	res.send(ret);
});

app.get('/find',function(req,res){
	var name = req.body.name;
	var ret = find(name);
	res.send(ret);
});

app.get('/user',function(req,res){

});

app.get('/revisions',function(req,res){
	var model = mongoose.model('revisions',RevisionSchema);
	var ret = model.find(function(err,docs){
		if(err){
			return err;
		}
		return docs;
	});
	res.send(ret);
});

app.get('/revisionTree',function(req,res){
	var model = mongoose.model('revisionbranches',RevisionBranchSchema);
	return model.find(function(err,docs){
		if(err){
			return err;
		}
		return docs;
	});
});

app.post('/revision',function(req,res){
	var model = mongoose.model('revisions',RevisionSchema);
	var bod = req.body;
	var rev = new model();
	rev.Text = bod.text;
	rev.Type = bod.type;
	console.log("REV::",rev);
	var ret = rev.save();
	return ret;
});

app.get('/', function(req, res){
	console.log("URL:",req.url);
	res.send("Hello World");
});

app.use(function(req, res, next){
	console.log("URL:",req.url);
	var p = __dir + 'pages' + req.url;
	if(path.existsSync(p)){
		res.sendfile(p);
	}
	else{
		var d = __dir.substring(0,__dir.length - 1);
	//	res.sendfile(d + req.url);
		res.send("don't worry about it");
	}
});



app.listen(3000);
console.log("listening");