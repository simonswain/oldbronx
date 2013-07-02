'use strict';

var bronx = require('./lib/bronx');
var server = require('./server/app');

module.exports = function(opts){  
  
  bronx.root = opts.root;
  var myserver = server(bronx);

  return {
    server:{
      start: function(){
        //console.log('starting server');
        myserver.start();
      }
    }
  }

}
