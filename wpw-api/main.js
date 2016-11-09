var config = require("config");
var express = require("express");
var logger = require("morgan");
var path = require("path");
var config = require("config");
var jsonWebToken = require("jsonwebtoken");
var bodyParser = require("body-parser");
var UserService = require("./db/user/service");

var app = express();
var apiRoutes = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logger("dev"));

app.set("token_private_key", config.token_private_key);

app.get("/", function(request, response) {
	response.send("Hello! The API is at http://localhost:" + config.port + "/api");
});

// Route for applying authentication to acquire token.
apiRoutes.post("/authenticate", function(request, response) {
  var username = request.body.username;
  var password = request.body.password;

	UserService.findUser(username)
    .then(function (user) {
      if (user === null) {
        response.json({ success: false, message: "Authentication failed. User not found." });
      } else if (user.password !== password) {
        response.json({ success: false, message: "Authentication failed. Wrong password." });
      } else {
        response.json({
					success: true,
					message: "Authentication succeed!",
					token: jsonWebToken.sign(user, app.get("token_private_key"), { expiresIn: 24 * 60 * 60 })
				});
      }
    }).catch(function (error) {
      response.json({ success: false, message: error });
    });
});

// Route middleware to authenticate and check token.
apiRoutes.use(function(request, response, next) {
	var token = request.body.token || request.param("token") || request.headers["x-access-token"];

	if (token !== undefined) {
		// verify token with private key.
		jsonWebToken.verify(token, app.get("token_private_key"), function(error, decoded) {
			if (error !== null && error !== undefined && error.message !== undefined) {
				return response.json({ success: false, message: "Failed to authenticate token." });
			} else {
				request.decoded = decoded;
				next();
			}
		});
	} else {
		return response.status(403).send({ success: false, message: "No token provided." });
	}
});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
apiRoutes.get("/", function (request, response) {
  response.json({ message: "hooray! welcome to our api!" });
});

apiRoutes.get("/users", function(request, response) {
	UserService.listUsers()
    .then(function (results) {
      response.json(results);
    }).catch(function (error) {
      response.json({ message: error });
    });
});

apiRoutes.get("/check", function(request, response) {
	response.json(request.decoded);
});

app.use("/api", apiRoutes);

app.set("port", config.port);

app.listen(config.port, function () {
  console.log("Listening on port:" + config.port);
});
