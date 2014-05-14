'use strict';

var path = require('path');
var render = require('./render');
var cwd = process.cwd();

module.exports = function (app, routes, options) {
  routes.forEach(register);

  app.get('/*', render(options));

  function register (route) {
    var middleware = [route.route, augment].concat(route.middleware || []);
    var ca = route.action.split('/');
    var ctrl = path.join(cwd, controllers, ca[0]);
    var action = ca[1];
    var fn = require(ctrl)[action];

    middleware.push(fn);
    app.get.apply(app, middleware);

    function augment (req, res, next) {
      res.partial = route.action;
      next();
    }
  }
};