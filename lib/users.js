"use strict";

var async = require('async');
var bcrypt = require('bcrypt');
var _ = require('underscore')._;


module.exports = function(db){

  var X = {}

  X.index = function(opts, next) {

    db.pool.acquire(
      function(err, conn){

        var users = [];
        var query = conn.query("SELECT * FROM users");

        query.on('row', function(x) {
          users.push({
            id: x.id,
            username: x.username,
            name_given: x.name_given,
            name_family: x.name_family,
            email: x.email
          });
        });
        query.on('end', function() {
          db.pool.release(conn);
          next(null, users);
        });

      });

  };


  return X;

};

// module.exports.count = function(opts, next) {

//   // no options passed
//   if ( arguments.length === 1 ){
//     next = arguments[0];
//     opts = {};    
//   }

//   db.pool.acquire(
//     function(err, conn){
      
//       var query;
//       var sql, args;
      
//       sql = "SELECT COUNT(*) AS count FROM users";

//       query = conn.query(
//         sql, 
//         args,
//         function(err, res){
//           db.pool.release(conn);
//           return next(null, res.rows[0].count);
//         });
      
//     });

// };


// var getById = module.exports.get = function(id, next) {

//   db.pool.acquire(

//     function(err, conn){

//       conn.query(
//         "SELECT * FROM users WHERE id = $1",
//         [id],
//         function(err, res){

//           if (!res.rows || res.rows.length === 0) {
//             db.pool.release(conn);
//             return next(null, false);
//           }

//           var x = res.rows[0];
//           var user = {
//             id: x.id,
//             privs: [],
//             username: x.username,
//             name_given: x.name_given,
//             name_family: x.name_family,
//             email: x.email
//           };

//           conn.query(
//             "SELECT priv FROM user_priv WHERE user_id = $1",
//             [id],
//             function(err, res){
//               res.rows.forEach(function(x){
//                 user.privs.push(x.priv);
//               });
//               db.pool.release(conn);
//               return next(null, user);
//             });
//         });
//     });

// };

// module.exports.getByUsername = function(username, next) {

//   db.pool.acquire(
//     function(err, conn){

//       var sql = "SELECT * FROM users WHERE username = $1";

//       var query = conn.query(
//         sql, 
//         [username]
//       );

//       var user = false;
//       query.on('row', function(x) {
//         user = {
//           id: x.id,
//           username: x.username,
//           name_given: x.name_given,
//           name_family: x.name_family,
//           email: x.email
//         };
//       });
//       query.on('end', function() {
//         db.pool.release(conn);
//         next(null, user);
//       });

//     });

// };

// module.exports.create = function(user, next) {

//   db.pool.acquire(
//     function(err, conn){

//       bcrypt.genSalt(10, function(err, salt){
//         bcrypt.hash(user.password, salt, function(err, hash){
//           user.password = hash;

//           var sql;
//           sql = "INSERT INTO users";
//           sql += " (username, password, email, name_given, name_family)";
//           sql += " VALUES ( $1, $2, $3, $4, $5 ) ";
//           sql += " RETURNING id";

//           var query = conn.query(
//             sql,
//             _.map(
//               ['username','password','email','name_given','name_family'],
//               function(i){
//                 return user[i] || '';
//               }));

//           query.on('row', function (row) {
//             user.id = row.id;
//           });
          
//           query.on('end', function() {
//             db.pool.release(conn);
//             next(null, user);
//           });        

//         });
//       });
//     });

// };


// module.exports.update = function(user, next) {

//   // if no user_id
//   if ( typeof user !== 'object' || typeof user.id === 'undefined' ) {
//     return next(new Error('Bad user or id'));
//   }

//   db.pool.acquire(
//     function(err, conn){

//       var f = [];
//       var g = [];
//       var ix = 1;

//       var sql = 'UPDATE users SET ';

//       ['email', 'name_given', 'name_family'].forEach(
//         function(x){
//           if (typeof user[x] !== 'undefined' ) {
//             f.push(user[x]);
//             g.push(x + '=$' + (ix));
//             ix++;
//           }
//         });

//       sql += g.join(', ');
//       sql += ' WHERE id=$' + ix;

//       f.push(user.id);

//       var query = conn.query(sql, f);

//       query.on('end', function() {
//         db.pool.release(conn);
//         return next(null, false);
//       });
//     });

// };

// module.exports.destroy = function(id, next) {
//   db.pool.acquire(
//     function(err, conn){

//       async.series([
//         function(done){
//           var query = conn.query(
//             "DELETE FROM users WHERE id = $1",
//             [id]
//           );
//           query.on('end', function(){done();});
//         },

//         function(done){
//           var query = conn.query(
//             "DELETE FROM user_priv WHERE user_id = $1",
//             [id]
//           );
//           query.on('end', function(){done();});
//         },

//         function(){
//           db.pool.release(conn);
//           next(null);
//         }
//       ]);

//     });
// };

// module.exports.setPassword = function(user_id, newPassword, next) {
//   db.pool.acquire(
//     function(err, conn){

//       bcrypt.genSalt(10, function(err, salt){
//         bcrypt.hash(newPassword, salt, function(err, hash){

//           var query = conn.query(
//             "UPDATE users SET password=$2 where id=$1",
//             [user_id, hash]
//           );

//           query.on('end', function() {
//             db.pool.release(conn);
//             next(null);
//           });
          
//         });
//       });
//     });
// };

// module.exports.auth = function(username, password, done) {

//   db.pool.acquire(
//     function(err, conn){

//       var sql = "SELECT id, password FROM users WHERE username=$1";

//       var query = conn.query (
//         sql,
//         [username]
//       );

//       var user_id = false;
//       var hash = false;
      
//       query.on('row', function(x) {
//         user_id = x.id;
//         hash = x.password;
//       });

//       query.on('end', function() {

//         db.pool.release(conn);

//         if (!hash) {
//           return done(null, false);
//         }

//         bcrypt.compare(password, hash, function(err, ok){

//           if (!ok) {
//             return done(null, false);
//           }

//           getById(user_id, function(err, user){
//             if (err) {
//               return done(err, false);
//             }
//             return done(null, user);
//           });
          
//         });
//       });
//     });
  
// };
