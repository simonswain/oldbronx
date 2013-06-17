'use strict';

var fs = require('fs');

module.exports = function(app, bronx){

  // if user logged in, serve app, else serve landing lage

  var home = function(req, res) {
    var access = false;
    if ( typeof req.user !== 'undefined' ) {
      access = 'user';      
      if ( req.user.privs.indexOf('admin') !== -1 ) {
        access = 'admin';
      }
    }
    if (access) {
      return res.render('app', {
        title: app.config.name,
        access: access
      });
    }

    return bronx.render(req, res, 'default', {title: app.config.name});

  };

  app.get('/', home);

};
