var UserService = require("./service");

UserService.listUsers()
  .then(function (results) {
    console.log(results);
  }).catch(function (error) {
    console.log(error);
  }).then(function () {
    process.exit();
  });
