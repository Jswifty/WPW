var removeARDDB = require("./db/accounts_receivable/clean");
var removeUserDB = require("./db/user/clean");

removeUserDB(function () {
  removeARDDB(function () {
    process.exit();
  }, function (error) {
    process.exit();
  });
}, function (error) {
  process.exit();
});
