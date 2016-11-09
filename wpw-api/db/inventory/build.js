var config = require("config");
var fs = require("fs");
var path = require("path");
var connector = require("./../connector");

var database = config.connection.database.inventory;
var createBrandTableSQL = getStringFromFile("./create_brand_table.sql");

module.exports = function (callback, failure) {
  callback = callback || function () {};
  failure = failure || function () {};

  connector.connect()
    .then(function (connection) {
      console.log("Creating inventory database...");
      return connector.createDatabase(database);
    }).then(function (results) {
      return connector.useDatabase(database);
    }).then(function (results) {
      console.log("Creating brand table...");
      return connector.query(createBrandTableSQL);
    }).then(function (results) {
      console.log("Inventory database created");
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
