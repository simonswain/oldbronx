"use strict";

var app = require('../server/app.js');

exports.user = {
  'start-server': function(test) {
    app.start(function(){
      test.done();
    });
  },
  'stop-server': function(test) {
    app.stop(function(){
      test.done();
    });
  }

};
