var config = require("config");
var fs = require("fs");
var path = require("path");
var connector = require("./../connector");

var database = config.connection.database.user;
var findUserSQL = getStringFromFile("./find_user.sql");
var createUserSQL = getStringFromFile("./insert_user.sql");

module.exports = function () {
  var UserService = this;

  UserService.getUser = function (username) {
    return new Promise(function (fulfill, reject) {
      if (username !== null) {
        findUserSQL = findUserSQL.replace("<username>", username);
        return runQuery(findUserSQL, function (results) {
            if (results.length > 0) {
              fulfill(results[0]);
            } else {
              fulfill(null);
            }
          }, reject);
      } else {
        reject("Error: username not found.");
      }
    });
  };

  UserService.createUser = function (user) {
    return new Promise(function (fulfill, reject) {
      if (user !== null && user.username !== null && user.password !== null) {
        return UserService.getUser(user.username)
          .then(function (existingUser) {
            if (existingUser !== null) {
              reject("Error: username already exists.");
            } else {
              createUserSQL = createUserSQL
                .replace("<username>", user.username)
                .replace("<password>", user.password)
                .replace("<privilege>", user.privilege || "00000000000000000000");
              return runQuery(createUserSQL, fulfill, reject);
            }
          });
      } else {
        reject("Error: please provide at least username and password.");
      }
    });
  };

  return UserService;
}();

function runQuery (query, callback, failure) {
  return connector.connect()
    .then(function (results) {
      return connector.useDatabase(database);
    }).then(function (results) {
      return connector.query(query);
    }).then(function (results) {
      callback(results);
    }).catch(function (error) {
      failure(error);
    }).then(function () {
      connector.disconnect();
    });
};

function getStringFromFile (filepath) {
  return fs.readFileSync(path.join(__dirname, filepath)).toString();
};
