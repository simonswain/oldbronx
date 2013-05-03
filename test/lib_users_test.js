'use strict';

var reset = require('../db/reset.js');
var users = require('../lib/bronx').users;

var newUser;

exports.users = {
  'reset': function(test) {
    reset( function() {      
      test.done();
    });
  },
  'get-non-existant': function(test) {
    test.expect(2);
    users.get('99999999-8888-7777-6666-555555555555', function(err, user) {
      test.equal(err, null, 'should be no error.');
      test.equal(user, false, 'should be false.');
      test.done();
    });
  },
  'create': function(test) {    
    test.expect(3);
    newUser = {
      username: 'username',
      password: 'password',
      email: '',
      name_given: 'Test',
      name_family: 'User'
    };   
    users.create(newUser, function(err, user) {
      test.equal(err, null, 'should be no error.');
      test.equal(typeof user, 'object', 'should be object.');
      test.equal(user.username, 'username', 'should match.');
      newUser.id = user.id;
      test.done();
    });
  },
  'get-by-id': function(test) {
    test.expect(3);
    users.get(newUser.id, function(err, user) {
      test.equal(err, null, 'should be no error.');
      test.equal(typeof user, 'object', 'should be object.');
      test.equal(user.username, 'username', 'should be username user.');
      test.done();
    });
  },
  'get-by-username': function(test) {
    test.expect(3);
    users.getByUsername(newUser.username, function(err, user) {
      test.equal(err, null, 'should be no error.');
      test.equal(typeof user, 'object', 'should be object.');
      test.equal(user.username, newUser.username, 'should be username user.');
      test.done();
    });
  },
  'update-user': function(test) {
    test.expect(4);
    var u = {
      id: newUser.id, 
      email:'test@test.com',
      name_given:'Name Given',
      name_family:'Name Family',
      foo:'Not this field'
    };
    users.update(u, function(err) {
      test.equal(err, null, 'should be no error.');
      users.getByUsername('username', function(err, user) {
        test.equal(u.email, user.email, 'should match');
        test.equal(u.name_given, user.name_given, 'should match');
        test.equal(u.name_family, user.name_family, 'should match');
        test.done();
      });
    });
  },
  'update-no-id': function(test) {
    test.expect(1);
    users.update({email:'new@email.com'}, function(err) {
      test.equal( err instanceof Error, true, 'should be error.');
      test.done();
    });
  },
  'auth': function(test) {
    test.expect(3);
    users.auth('username','password', function(err, user) {
      test.equal(err, null, 'should be no error.');
      test.equal(typeof user, 'object', 'should be object.');
      test.equal(user.username, 'username', 'should be username user.');
      test.done();
    });
  },
  'auth-fail': function(test) {
    test.expect(2);
    users.auth('username','badpassword', function(err, user) {
      test.equal(err, null, 'should be no error.');
      test.equal(user, false, 'should be false.');
      test.done();
    });
  },
  'set-password': function(test) {
    test.expect(4);
    users.setPassword(newUser.id, 'newpassword', function(err) {
      test.equal(err, null, 'should be no error.');
      users.auth('username', 'newpassword', function(err, user) {
        test.equal(err, null, 'should be no error.');
        test.equal(typeof user, 'object', 'should be object.');
        test.equal(user.username, 'username', 'should be username user.');
        test.done();
      });
    });
  },
  'destroy': function(test) {    
    test.expect(1);
    users.destroy(newUser.id, function(err) {
      test.equal(err, null, 'should be no error');
      test.done();
    });
  },
  'index': function(test) {
    test.expect(3);
    users.index(false, function(err, users) {
      test.equal(err, null, 'should be no error.');
      // the init sql has one (admin) user
      test.equal(users.length, 1, 'should be one user');
      test.equal(users[0].username, 'admin', 'should be admin user.');
      test.done();
    });
  }
};
