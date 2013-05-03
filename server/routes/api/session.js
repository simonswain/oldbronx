'use strict';

var response = require('./response');
var auth = require('./auth');

module.exports = function(app){

  var config = app.config;
  var passport = app.passport, LocalStrategy = app.LocalStrategy;

  /**
   * create new user
   */
  app.post(
    '/api/sign-up', 
    function(req, res) {
      // validate
      var user = req.body;

      var invalid = [];

      if(!user.hasOwnProperty('username')){
        invalid.push('username');
      }

      if(!user.hasOwnProperty('password')){
        invalid.push('username');
      }
      
      if(invalid.length > 0){
        return response.invalid(res, invalid);
      }

      app.bronx.users.getByUsername(user.username, function(err, u) {

        if(u){
          invalid.push('username-unavailable');
          return response.invalid(res, invalid);
        }

        app.bronx.users.create(user, function(err, u){
          return response.ok(req, res);
        });

      });
    });

  /**
   * associate user from session
   */
  app.post(
    '/api/sign-in', 
    passport.authenticate('local'),
    function(req, res) {
      // If this function gets called, authentication was successful.
      // `req.user` property contains the authenticated user.
      var user = {
        username: req.user.username,
        name_given: req.user.name_given,
        name_family: req.user.name_family,
        email: req.user.email,
        privs:req.user.privs
      };
      response.json(req, res, user);
    });

  /**
   * disassociate user from session
   */
  app.post(
    '/api/sign-out', 
    function(req, res){
      req.logOut();
      var r = {user: false};
      response.json(req, res, r);
    });

  /**
   * get details of the user associated with current sess
   */
  app.get(
    '/api/session', 
    function(req, res){
      var user = false;
      if (req.user !== undefined){
        user = {
          username: req.user.username,
          name_given: req.user.name_given,
          name_family: req.user.name_family,
          email: req.user.email,
          privs:req.user.privs
        };
      }
      response.json(req, res, user);
    });

  /**
   * session let server know it's present
   */
  app.post (
    '/api/session/ping',
    auth.user(),
    function(req, res) {
      return response.ok(req, res);
    });

  /**
   * user update themselves
   */
  app.post (
    '/api/session',
    auth.user(),
    function(req, res) {
      var user = {id: req.session.passport.user};     

      ['email','name_given','name_family'].forEach(
        function(x){
          if (typeof req.body[x] !== 'undefined' ) {
            user[x] = req.body[x];
          }
        });

      app.bronx.users.update(user, function(err){
        return response.json(req, res, {result:'ok'});
      });

    });

  /**
   * admin switch user
   */
  app.post (
    '/api/session/impersonate/:username',
    auth.user('admin'),
    function(req, res) {
      app.bronx.users.getByUsername(
        req.params.username, 
        function(err, user){
          if (!user) {
            return response.not_found(res);
          }
          req.session.passport.user = user.id;
          return response.json(req, res, {result:'ok'});
        });
    });

};
