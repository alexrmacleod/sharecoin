const routes = require("next-routes")();
routes
  .add("/coins/new", "/coins/new")
  .add("/coins/:address", "/coins/show")
  .add("/coins/:address/proposals", "/coins/proposals/index")
  .add("/coins/:address/proposals/new", "/coins/proposals/new");
module.exports = routes;
