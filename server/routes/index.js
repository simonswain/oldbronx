'use strict';

var fs = require('fs');

module.exports = function(app){

  // if user logged in, serve app, else serve landing lage

  var home = function(req, res) {
    // var access = false;
    // if ( typeof req.user !== 'undefined' ) {
    //   access = 'user';      
    //   if ( req.user.privs.indexOf('admin') !== -1 ) {
    //     access = 'admin';
    //   }
    // }
    // if ( access ) {
    //   return res.render('app', {
    //     title: app.config.name,
    //     access: access
    //   });
    // }
    return res.render('index', {title: app.config.name});
  };

  app.get('/', home);

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

  app.get('*', home);

};
