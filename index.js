"use strict";

var server = require('./server/app');

module.exports = function(opts, done){  
  
  var db = require('./lib/db')(opts.config);

  var bronx = {
    root: opts.root,
    config: opts.config,
    db: db,
    api: {
      users: require('./lib/users')(db)
    }
  }

  
  var myserver = server(bronx);

  bronx.server = {
    start: function(){
      console.log('starting server');
      myserver.start();
    }
  };

  done(null, bronx);
  

}
