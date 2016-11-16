var config = require("config");
var runQuery = require("./../db/run_query");
var UserService = require("./../db/user/service");

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
          response.json({ status: "authentication", data: { success: false, message: "Authentication failed. User not found." } });
        } else if (user.password !== password) {
          response.json({ status: "authentication", data: { success: false, message: "Authentication failed. Wrong password." } });
        } else {
          response.json({
            status: "authentication",
            data: {
    					success: true,
    					message: "Authentication succeed!",
    					token: jsonWebToken.sign(user, app.get("token_private_key"), { expiresIn: 24 * 60 * 60 })
            }
  				});
        }
      }).catch(function (error) {
        response.json({ status: "error", data: { success: false, error: error } });
      });
  });

  // Route middleware to authenticate and check token.
  routes.use(function(request, response, next) {
  	next(); // bypass authentication for now
    //
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
    runQuery("SHOW DATABASES", null)
      .then(function (results) {
        var databases = toStringArray(results)
        databases = databases.filter((string) => string.startsWith("wpw") && string !== "wpw_user");
        var databaseNames = databases.map((string) => config.look_up_names[string]);
        response.json({ status: "databases", data: { title: "Databases", databases: databases, databaseNames: databaseNames } });
      }).catch(function (error) {
        response.json({ status: "error", data: { title: "Error", error: error } });
      });
  });

  routes.get("/users", function(request, response) {
  	UserService.listUsers()
      .then(function (results) {
        response.json({ status: "results", data: { title: "Users", results: results } });
      }).catch(function (error) {
        response.json({ status: "error", data: { title: "Error", error: error } });
      });
  });

  routes.get("/check", function(request, response) {
  	response.json(request.decoded);
  });

  // database and table query access routes
  routes.get(/\/\w+/, function (request, response) {
    var pathname = request && request._parsedUrl && request._parsedUrl.pathname;
    pathname = pathname.replace(/(^\/|\/$)/g, "").split("/");
    var database = pathname && pathname[0];
    var databaseName = database && config.look_up_names[database];
    var table = pathname && pathname[1];
    var query = request && request.query;
    var data = { databaseName: databaseName, database: database };


    runQuery("SHOW TABLES", database)
      .then(function (results) {
        data.tables = toStringArray(results).filter((string) => string !== "view");
        data.tableNames = data.tables.map((string) => config.look_up_names[string]);
        return runQuery("SELECT * FROM view", database);
      }).then(function (results) {
        data.views = results;
        if (table !== undefined) {
          return renderResults(database, table, query, data, response);
        } else {
          response.json({ status: "tables", data: data });
        }
      }).catch(function (error) {
        response.json({ status: "error", data: { title: "Error", error: error } });
      });
  });

  return routes;
};

function toStringArray (results) {
  var array = [];

  if (results.length > 0) {
    var headers = Object.keys(results[0]);

    for (var i = 0; i < results.length; i++) {
      array.push(results[i][headers[0]]);
    }
  }

  return array;
};

function renderResults (database, table, query, data, response) {
  var columns = query && query.columns || "*";
  var where = query && query.filter;
  var sort = query && query.sort;
  var queryString = "SELECT " + columns + " FROM " + table + (where ? " WHERE " + where : "") + (sort ? " ORDER BY " + sort : "");

  data.table = table;
  data.sort = sort;

  return runQuery(queryString, database)
    .then(function (results) {
      data.results = results;
      response.json({ status: "results", data: data });
    });
};
