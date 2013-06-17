'use strict';

var fs = require('fs');

module.exports = function(app, bronx){

  var signup = function(req, res) {

    // css/style.less > style.css auto added
    // js/script.js auto added with path js/<module>/script.js

    // bronx.add('foo.js');
    // bronx.add('backbone');
    // bronx.add('jquery');

    // bronx.add('jquery','foo.js','bar.css');

    return bronx.render(req, res, 'default', {title: app.config.name});

  }; 

  app.get('/signup', signup);

  //bronx.get('/signup', bronx.auth('admin'), signup);
  
};
