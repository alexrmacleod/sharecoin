const routes = require("next-routes")();
routes
  .add("/coins/new", "/coins/new")
  .add("/coins/:address", "/coins/show")
  .add("/coins/:address/requests", "/coins/requests/index")
  .add("/coins/:address/requests/new", "/coins/requests/new");
module.exports = routes;
