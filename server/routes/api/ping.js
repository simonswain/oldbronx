'use strict';

var response = require('./response');

module.exports = function(app){

  app.get(
    '/api/ping', 
    function(req, res) {
      response.json(req, res, { pong: new Date().getTime() });
    });

  app.post(
    '/api/ping', 
    function(req, res) {
      response.json(req, res, { pong: new Date().getTime() });
    });

};
