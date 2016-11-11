var arguments = process.argv;

if (arguments !== null && arguments.length >= 4) {
  var database = arguments[2];
  var query = arguments[3];

  require("./run_query")(query, database, function (results) {
    console.log(results);
  }, function (error) {
    console.log(error);
  });
} else {
  console.log("Please provide database and query.");
}
