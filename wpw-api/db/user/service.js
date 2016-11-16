var config = require("config");
var Promise = require("bluebird");
var runQuery = require("./../run_query");

var database = config.database.user;

module.exports = function () {
  var UserService = this;

  UserService.listUsers = function () {
    return runQuery("SELECT username, privilege FROM user;", database)
      .then(function (results) {
        var userList = [];

        for (var i = 0; i < results.length; i++) {
          userList.push({ username: results[i].username, privilege: results[i].privilege });
        }

        return userList;
      });
  };

  UserService.findUser = function (username) {
    return new Promise(function (fulfill, reject) {
      if (username !== null) {
        return runQuery("SELECT * FROM user WHERE username=\"" + username + "\";", database)
          .then((results) => results.length > 0 ? results[0] : null)
          .then(fulfill);
      } else {
        reject("Error: username not found.");
      }
    });
  };

  UserService.createUser = function (user) {
    return new Promise(function (fulfill, reject) {
      if (user !== null && user.username !== null && user.password !== null) {
        return UserService.findUser(user.username)
          .then(function (existingUser) {
            if (existingUser !== null) {
              reject("Error: username already exists.");
            } else {
              var insertQuery = [
                "INSERT INTO user (username, password)",
                " VALUES (\"" + user.username + "\", \"" + user.password + "\");"
              ].join("");

              return runQuery(insertQuery, database);
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
