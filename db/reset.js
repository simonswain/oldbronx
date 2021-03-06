'use strict';

module.exports = function(done) {

  var db = require('../lib/bronx').db;

  var fs = require('fs');
  var schema = fs.readFileSync ( __dirname + '/schema.sql', 'ascii');
  var init = fs.readFileSync ( __dirname + '/init.sql', 'ascii');

  db.conn(
    function(err, conn){
      conn.query(schema, function(err, res){
        if(err){
          console.log(err);
          process.exit(0);
        }
        conn.query(init, function(err, res){
          conn.end();
          done();
        });
      });
    });

};
