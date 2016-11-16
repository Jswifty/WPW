var express = require("express");
var logger = require("morgan");
var path = require("path");
var config = require("config");
var favicon = require("serve-favicon");

var app = express();
var routes = require("./app/routes")(express, app);

app.set("port", config.port);
app.set("views", path.join(__dirname, "source", "templates"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(express.static(__dirname + "/static"));
app.use(favicon(path.join(__dirname, "static", "images", "icon.png")));

app.use("/", routes);

app.use(function (request, response, next) {
  var error = new Error("Not Found", { title: "Error" });
  error.status = 404;

  try {
    response.render("error", { error: error });
  } catch (error) {
    next(error);
  }
});

app.listen(config.port, function () {
  console.log("Listening on port:" + config.port);
});
