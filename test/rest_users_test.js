"use strict";

var reset = require('../db/reset.js');

var app = require('../server/app.js');
var config = require('../lib/bronx').config;

var http = require('nodeunit-httpclient').create({
  port: config.port,
  path: '/',
  status: 200
});


var myuser = {
  'username': 'myuser',
  'password': 'myuser'
};

exports.user = {
  'setUp': function(callback) {
    //this.__log = console.log;
    callback();
  },
  'tearDown': function(callback) {
    //console.log = this.__log;
    callback();
  },
  'reset': function(test) {
    reset( function() {      
      test.done();
    });
  },
  'start-server': function(test) {
    app.start(function(){
      test.done();
    });
  },
  'sign-up': function(test) {
    test.expect(1);
    http.post( test, 'api/sign-up', {
      data:{
        'username': myuser.username,
        'password': myuser.password
      }
    }, {
      status: 204
    }, function() {
      test.done();
    });
  },
  'sign-up-taken': function(test) {
    test.expect(2);
    http.post( test, 'api/sign-up', {
      data:{
        'username': myuser.username,
        'password': myuser.password
      }
    }, {
      status: 400
    },  function(res) {
      test.deepEqual(JSON.parse(res.body), ['username-unavailable'], 'username should be taken');
      test.done();
    });
  },
  'sign-in': function(test) {
    test.expect(2);
    http.post( test, 'api/sign-in', {
      data:{
        'username': myuser.username,
        'password': myuser.password
      }
    }, function(res) {
      var user = JSON.parse(res.body);
      test.equals(user.username, myuser.username, 'username should match');
      myuser.cookie = res.headers['set-cookie'][0].split(';')[0];
      test.done();
    });
  },
  'session': function(test) {
    test.expect(2);
    http.get( test, 'api/session', {
      headers:{
        'Cookie': myuser.cookie
      }
    }, {
      status: 200
    }, function(res) {
      var user = JSON.parse(res.body);
      test.equals(user.username, myuser.username, 'username should match');
      test.done();
    });
  },
  'stop-server': function(test) {
    app.stop(function(){
      test.done();
    });
  }

};
