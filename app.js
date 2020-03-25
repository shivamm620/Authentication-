//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyPaser = require("body-Parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption")
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyPaser.urlencoded({
  extended: true
}));
mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const userSechma = new mongoose.Schema({
  email: String,
  password: String
});
userSechma.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ['password'],
});
// Object.schema.methods.authenticateSync
const User = new mongoose.model("User", userSechma);
app.get("/", function(req, res) {
  res.render("home");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});
app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets")
    }
  });
});
app.post("/login", function(req, res) {
  const username = req.body.username
  const password = req.body.password
  User.findOne({
    email: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets")
        }
      }
    }
  })
})
app.listen(3000, function() {
  console.log("server is running on port 3000");
});
