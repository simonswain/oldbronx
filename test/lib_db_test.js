"use strict";

// var api = require('../lib/bronx.js').api;

// exports.devices = {
//   'callback-query': function(test) {    
//     api.db.conn(
//       function(err, conn){
//         conn.query(
//           'SELECT NOW()', 
//           function (err, res) {
//             test.equals(err, null, 'no error');
//             test.equals(res.rows.length, 1, '1 row');
//             conn.end();
//             test.done();              
//           });
//       });
//   },
//   'pool-query': function(test) {    
//     api.db.pool.acquire(
//       function(err, conn){
//         var query = conn.query('SELECT pg_get_keywords()');
//         var res = [];

//         query.on('row', function(x) {
//           res.push(x);
//         });

//         // query.on('error', function(err) {
//         //   test.equals(err, null, 'no error');
//         //   test.ok(false, 'got error from query');
//         //   db.pool.release(conn);
//         //   test.done();
//         // });

//         query.on('end', function() {
//           test.ok(true, 'got results from query');
//           api.db.pool.release(conn);
//           test.done();
//         });
//       });
//   }
// };
