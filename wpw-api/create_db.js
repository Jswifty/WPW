var createARDDB = require("./db/accounts_receivable/create");
var createUserDB = require("./db/user/create");

createUserDB(function () {
  createARDDB(function () {
    process.exit();
  }, function (error) {
    process.exit();
  });
}, function (error) {
  process.exit();
});
