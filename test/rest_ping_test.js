'use strict';

var app = require('../server/app.js');
var config = require('../lib/bronx').config;

var http = require('nodeunit-httpclient').create({
  port: config.port,
  path: '/',
  status: 200
});

exports['server'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'start-server': function(test) {
    app.start(function(){
      test.done();
    });
  },
  'ping': function(test) {
    test.expect(2);
    http.get(test, 'api/ping', function(res) {
      test.ok(res.data, 'Got Pong back from Ping');
      test.done();
    });
  },
  'stop-server': function(test) {
    app.stop(function(){
      test.done();
    });
  }
};
