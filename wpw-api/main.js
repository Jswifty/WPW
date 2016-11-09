var config = require("config");
var express = require("express");
var logger = require("morgan");
var path = require("path");
var config = require("config");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("port", config.port);
app.use(logger("dev"));

app.use("/", function (request, response) {
  response.json({ message: "hooray! welcome to our api!" });
});

app.use(function (request, response, next) {
  var error = new Error("Not Found");
  error.status = 404;
});

app.listen(config.port, function () {
  console.log("Listening on port:" + config.port);
});
