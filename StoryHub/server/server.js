var express = require('express');
var app = express();

var MONGOHQ_URL="mongodb://jeffhoffman1:a1234567@dharma.mongohq.com:10061/storyhub";
var test, mongoose, _;

var passport = require('passport');

app.post('/login', passport.authenticate('local', 
	{ successRedirect: '/',
      failureRedirect: '/login' }));
	  
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
	RevisionID : String,
	UserID	: String,
	StoryID : String,
	Type	: String,
	RevisionBranchID : String,
	Text	: String,
	Upvotes	: Number,
	Downvotes : Number
});

var RevisionBranchSchema = new Schema({
	RevisionBranchID : String,
	RevisionIDs	: String,
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
