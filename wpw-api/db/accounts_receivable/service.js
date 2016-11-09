var config = require("config");
var Promise = require("bluebird");
var connector = require("./../connector");
var runQuery = require("./../run_query");

var database = config.connection.database.wpw_accounts_receivable;

module.exports = function () {
  var ARService = this;

  ARService.listDebtors = function (options) {
    options = options || {};

    var columns = options.columns || [];
    var columnString = columns.length > 0 ? columns.join(", ");

    return new Promise(function (fulfill, reject) {
      runQuery("SELECT " + columnString + " FROM debtor" + ";", database, function (results) {
        var userList = [];

        for (var i = 0; i < results.length; i++) {
          userList.push({ username: results[i].username, privilege: results[i].privilege });
        }

        fulfill(userList);
      }, reject);
    });
  };

  return ARService;
}();
