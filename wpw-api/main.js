var config = require("config");
var express = require("express");
var logger = require("morgan");
var path = require("path");
var config = require("config");
var jsonWebToken = require("jsonwebtoken");
var bodyParser = require("body-parser");

var app = express();
var routes = require("./app/routes")(express, app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logger("dev"));

app.use("/", routes);

app.set("port", config.port);

app.listen(config.port, function () {
  console.log("Listening on port:" + config.port);
});
