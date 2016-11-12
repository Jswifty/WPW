var arguments = process.argv;

if (arguments !== null && arguments.length >= 5) {
  var database = arguments[2];
  var table = arguments[3];
  var csvFilepath = arguments[4];
  var fs = require("fs");
  var csv = require("csv");
  var connector = require("./db/connector");

  var fileString = fs.readFileSync(csvFilepath).toString();

  csv.parse(fileString, function (err, data) {
    var headers = data[0].join(",").trim();
    var values = [];
    for (var i = 1; i < data.length; i++) {
      var line = data[i].map(function (d) { return d.replace(/'/g, "''"); });
      values.push("('" + line.join("','") + "')");
    }
    values = values.join(",").replace(/,''/g, ",NULL").replace(/'',/g, "NULL,");

    var importQuery = "INSERT INTO " + table + " (" + headers + ") VALUES " + values + ";";

    require("./db/run_query")(importQuery, database, function (results) {
      console.log("Import completed.");
      process.exit();
    }, function (error) {
      console.log(error);
      process.exit();
    });
  });
} else {
  console.log("Please provide database, table and a CSV file.");
}
