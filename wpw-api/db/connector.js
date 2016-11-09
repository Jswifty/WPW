var config = require("config");
var Promise = require("bluebird");
var mysql = require("mysql");

var pool = mysql.createPool({
  connectionLimit : 100,
  host: config.connection.host,
  user: config.connection.user,
  password: config.connection.password,
  debug:  false
});

module.exports = function () {
  var connector = this;
  connector.connection = null;
  connector.database = null;

  connector.connect = function () {
    return new Promise(function (fulfill, reject) {
      connector.disconnect();

      pool.getConnection(function (error, connection) {
        if (error !== null && error !== undefined && error.message !== undefined) {
          reject("Connection failed - " + error.message);
          return;
        }

        connector.connection = connection;
        fulfill(connection);
      });
    });
  };

  connector.disconnect = function () {
    if (connector.connection !== null) {
      connector.connection.release();
    }

    connector.connection = null;
    connector.database = null;
  };

  connector.query = function (query) {
    return new Promise(function (fulfill, reject) {
      if (connector.connection !== null && connector.database !== null) {
        connector.connection.query(query, function (error, results) {
          if (error !== null && error !== undefined && error.message !== undefined) {
            reject("Query Failed - " + error.message);
          } else {
            fulfill(results);
          }
        });
      } else {
        reject("Query Failed - connection not established or database not selected.");
      }
    });
  };

  connector.useDatabase = function (database) {
    return new Promise(function (fulfill, reject) {
      connector.connection.query("USE " + database, function (error, results) {
        if (error !== null && error !== undefined && error.message !== undefined) {
          reject("Select database Failed - " + error.message);
        } else {
          connector.database = database;
          fulfill(results);
        }
      });
    });
  };

  connector.createDatabase = function (database) {
    return new Promise(function (fulfill, reject) {
      connector.connection.query("CREATE DATABASE IF NOT EXISTS " + database, function (error, results) {
        if (error !== null && error !== undefined && error.message !== undefined) {
          reject("Create database Failed - " + error.message);
        } else {
          fulfill(results);
        }
      });
    });
  };

  return connector;
}();
