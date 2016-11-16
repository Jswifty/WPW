var config = require("config");
var axios = require("axios");
var apiURL = "http://" + config.api.host + ":" + config.api.port;

module.exports = function (express, app) {
  var routes = express.Router();

  routes.get(/.*/, function (request, response) {
    axios.get(apiURL + request._parsedUrl.path)
      .then(function (apiResponse) {
        var data = apiResponse.data;

        try {
          response.render(data.status, data.data);
        } catch (error) {
          response.render("error", { error: error });
        }
      });
  });

  return routes;
};
