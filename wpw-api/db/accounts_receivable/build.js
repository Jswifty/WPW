var config = require("config");
var fs = require("fs");
var path = require("path");
var connector = require("./../connector");

var database = config.database.accounts_receivable;
var buildSQL = getStringFromFile("./create_debtor_table.sql");

module.exports = function (callback, failure) {
  callback = callback || function () {};
  failure = failure || function () {};

  connector.connect()
    .then(function (connection) {
      console.log("Creating accounts receivable database...");
      return connector.createDatabase(database);
    }).then(function (results) {
      return connector.useDatabase(database);
    }).then(function (results) {
      console.log("Creating debtor table...");
      return connector.query(createDebtorTableSQL);
    }).then(function (results) {
      console.log("Accounts receivable database created");
      callback(results);
    }).catch(function (error) {
      console.log(error);
      failure(error);
    }).then(function () {
      connector.disconnect();
    });
};

function getStringFromFile (filepath) {
  return fs.readFileSync(path.join(__dirname, filepath)).toString();
};
