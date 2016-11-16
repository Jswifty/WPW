var config = require("config");
var connector = require("./../connector");
var database = config.database.accounts_receivable;

module.exports = function (callback, failure) {
  callback = callback || function () {};
  failure = failure || function () {};

  connector.connect()
    .then(function (connection) {
      console.log("Removing accounts receivable database...");
      return connector.query("DROP DATABASE " + database);
    }).then(function (results) {
      console.log("Accounts receivable database removed.");
      callback(results);
    }).catch(function (error) {
      console.log(error);
      failure(error);
    }).then(function () {
      connector.disconnect();
    });
};
