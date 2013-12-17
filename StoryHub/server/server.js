var express = require('express');
var app = express();

var MONGOHQ_URL="mongodb://jeffhoffman1:a1234567@dharma.mongohq.com:10061/storyhub"
var test, hero, mongoose, _;

var passport = require('passport');

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login' }));
 
mongoose = require("mongoose");
 
_ = require("underscore");
 
mongoose.connect(MONGOHQ_URL);
 console.log("CONNECTED!");
test = mongoose.model('test', { name: "string" });
 console.log("MODELED!");
hero = new test({
  name: "Superman"
});
 console.log("HERO!",hero);
hero.save(function(err) {
console.log("SAVE?");
  if (err) {
    return console.log("fail");
  } else {
    return console.log("win");
  }
});
 console.log("SAVED!");
test.find({}, function(err, documents) {
console.log("DOCS!",documents);
  return console.log(documents[0]);
});
console.log("FOUND!");