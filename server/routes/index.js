'use strict';

var fs = require('fs');

module.exports = function(app){

  fs.readdirSync(__dirname).forEach(function(file) {

    if (file === 'index.js') {
      return;
    }

    if ( file.substr(0,1) === '.' ) {
      return;
    }

    if ( file.substr(0,1) === '#' ) {
      return;
    }

    var stats = fs.statSync(__dirname + '/' + file );
    if ( stats.isDirectory()) {
      require('./' + file + '/index.js')(app);
      return;
    }

    if ( ! stats.isFile()) {
      return;
    }

    var name = file.substr(0, file.indexOf('.'));
    require('./' + name)(app);

  });

  //app.get('*', home);

};
