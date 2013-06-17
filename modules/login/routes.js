'use strict';

module.exports = function(app, bronx){

  var login = function(req, res) {
    return bronx.render(req, res, 'default', {title: app.config.name});
  }; 

  var logout = function(req, res) {
    req.logOut();
    res.redirect('/');
  }; 

  app.get('/login', login);
  app.get('/logout', logout);

};
