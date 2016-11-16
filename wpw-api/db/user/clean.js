var config = require("config");
var connector = require("./../connector");
var database = config.database.user;

module.exports = function (callback, failure) {
  callback = callback || function () {};
  failure = failure || function () {};

  connector.connect()
    .then(function (connection) {
      console.log("Removing user database...");
      return connector.query("DROP DATABASE " + database);
    }).then(function (results) {
      console.log("User database removed.");
      callback(results);
    }).catch(function (error) {
      console.log(error);
      failure(error);
    }).then(function () {
      connector.disconnect();
    });
};
