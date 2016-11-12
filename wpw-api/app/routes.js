var config = require("config");
var runQuery = require("./../db/run_query");

module.exports = function (express, app) {
  var routes = express.Router();

  app.set("token_private_key", config.token_private_key);

  // Route for applying authentication to acquire token.
  routes.post("/authenticate", function(request, response) {
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
  routes.use(function(request, response, next) {
  	next(); // bypass authentication for now

  	// var token = request.body.token || request.param("token") || request.headers["x-access-token"];
  	//
  	// if (token !== undefined) {
  	// 	// verify token with private key.
  	// 	jsonWebToken.verify(token, app.get("token_private_key"), function(error, decoded) {
  	// 		if (error !== null && error !== undefined && error.message !== undefined) {
  	// 			return response.json({ success: false, message: "Failed to authenticate token." });
  	// 		} else {
  	// 			request.decoded = decoded;
  	// 			next();
  	// 		}
  	// 	});
  	// } else {
  	// 	return response.status(403).send({ success: false, message: "No token provided." });
  	// }
  });

  // ---------------------------------------------------------
  // authenticated routes
  // ---------------------------------------------------------
  routes.get("/", function (request, response) {
    response.json({ message: "This is WPW Database API." });
  });

  routes.get(/\/\w+/, function (request, response) {
    var database = request && request._parsedUrl && request._parsedUrl.pathname.replace(/\//g, "");
    var query = request && request.query && request.query.query;

    if (query !== undefined) {
      runQuery(query, database, function (results) {
        response.json(results);
      }, function (error) {
        response.json({ message: error });
      });
    } else {
      response.json({ message: "Please provide a database query in the query parameter." });
    }
  });

  routes.get("/users", function(request, response) {
  	UserService.listUsers()
      .then(function (results) {
        response.json(results);
      }).catch(function (error) {
        response.json({ message: error });
      });
  });

  routes.get("/check", function(request, response) {
  	response.json(request.decoded);
  });

  return routes;
};
