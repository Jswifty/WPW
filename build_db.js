var buildARDDB = require("./db/accounts_receivable/build");
var buildInventoryDB = require("./db/inventory/build");
var buildUserDB = require("./db/user/build");

buildARDDB(function () {
  buildInventoryDB(function () {
    buildUserDB(function () {
      process.exit();
    })
  });
});
