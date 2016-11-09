var arguments = process.argv;

if (arguments !== null && arguments.length >= 4) {
  var username = arguments[2];
  var password = arguments[3];
  var UserService = require("./db/user/userservice");

  UserService.createUser({ username: username, password: password})
    .then(function (results) {
      console.log("User \"" + username + "\" created");
    }).catch(function (error) {
      console.log(error);
    }).then(function () {
      process.exit();
    });
}
