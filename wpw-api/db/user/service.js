var config = require("config");
var Promise = require("bluebird");
var runQuery = require("./../run_query");

var database = config.database.user;

module.exports = function () {
  var UserService = this;

  UserService.listUsers = function () {
    return new Promise(function (fulfill, reject) {
      var listQuery = "SELECT username, privilege FROM user;";
      var getResults = function (results) {
        var userList = [];

        for (var i = 0; i < results.length; i++) {
          userList.push({ username: results[i].username, privilege: results[i].privilege });
        }

        fulfill(userList);
      };

      runQuery(listQuery, database, getResults, reject);
    });
  };

  UserService.findUser = function (username) {
    return new Promise(function (fulfill, reject) {
      if (username !== null) {
        var findQuery = "SELECT * FROM user WHERE username=\"" + username + "\";";
        var getResults = function (results) {
          if (results.length > 0) {
            fulfill(results[0]);
          } else {
            fulfill(null);
          }
        };

        runQuery(findQuery, database, getResults, reject);
      } else {
        reject("Error: username not found.");
      }
    });
  };

  UserService.createUser = function (user) {
    return new Promise(function (fulfill, reject) {
      if (user !== null && user.username !== null && user.password !== null) {
        user.privilege = user.privilege || "00000000000000000000";
        return UserService.findUser(user.username)
          .then(function (existingUser) {
            if (existingUser !== null) {
              reject("Error: username already exists.");
            } else {
              var insertQuery = [
                "INSERT INTO user (username, password, privilege )",
                " VALUES (\"" + user.username + "\", \"" + user.password + "\", \"" + user.privilege + "\");"
              ].join("");

              runQuery(insertQuery, database, fulfill, reject);
            }
          }).catch(function (error) {
            reject(error);
          });
      } else {
        reject("Error: please provide at least username and password.");
      }
    });
  };

  return UserService;
}();
