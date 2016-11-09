var connector = require("./connector");

module.exports = function (query, database, callback, failure) {
  callback = callback || function () {};
  failure = failure || function () {};

  if (typeof query === "string" && typeof database === "string") {
    connector.connect()
      .then(function () {
        return connector.useDatabase(database);
      }).then(function () {
        return connector.query(query);
      }).then(function (results) {
        callback(results);
      }).catch(function (error) {
        failure(error);
      }).then(function () {
        connector.disconnect();
      });
  } else {
    failure("Error: query or database is not valid.");
  }
};
