var connector = require("./connector");
var Promise = require("bluebird");

module.exports = function (query, database) {
  return new Promise(function (fulfill, reject) {
    if (typeof query === "string") {
      connector.connect()
        .then(function () {
          return typeof database === "string" ? connector.useDatabase(database) : null;
        }).then(function () {
          return connector.query(query);
        }).then(function (results) {
          fulfill(results);
        }).catch(function (error) {
          reject(error);
        }).then(function () {
          connector.disconnect();
        });
    } else {
      reject("Error: query is not valid.");
    }
  });
};
