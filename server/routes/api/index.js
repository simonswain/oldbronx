'use strict';

var fs = require('fs');

module.exports = function(app){

  fs.readdirSync(__dirname).forEach(function(file) {

    // these helpers are loaded by api modules as required

    if (file === 'index.js') {
      return;
    }

    if (file === 'auth.js') {
      return;
    }

    if (file === 'response.js') {
      return;
    }

    // other junk we can ignore

    if (file.substr(0,1) === '.') {
      return;
    }

    if (file.substr(0,1) === '#') {
      return;
    }

    var stats = fs.statSync(__dirname + '/' + file);

    if (!stats.isFile()) {
      return;
    }

    // auto-load api methods

    var name = file.substr(0, file.indexOf('.'));
    require('./' + name)(app);

  });

};
