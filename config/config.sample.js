var env = process.env.NODE_ENV || 'dev';

var name = 'Bronx';

var opts = {
};

var redis = {
  host: '127.0.0.1',
  port: 6379,
  prefix: env
};

var pg = {
  host:'localhost', 
  port: 5432,
  username: '', 
  password: '', 
  database: 'bronx'
};

switch ( env ) {
case 'test' :
  name = 'Test';
  exports.port = 3003;
  pg.password = '', 
  pg.database += '_test';
  break;

case 'dev' :
  name = 'Dev';
  exports.port = 3002;
  pg.password = '', 
  pg.database += '_dev';
  break;

case 'stage' :
  name = 'Stage';
  exports.port = 3001;
  pg.password = '', 
  pg.database += '_stage';
  break;

case 'production' :
  exports.port = 3000;  
  pg.password = '', 
  pg.database += '_live';
  break;
}


// anydb
var db = {
  poolMin: 2,
  poolMax: 15,
  url: 'postgres://' + pg.username + ':' + pg.password + '@' + pg.host + '/' + pg.database
};

exports.env = env;
exports.opts = opts;
exports.secret = 'sessionsecret';
exports.hashid_salt = 'this is the hashid salt';
exports.name = name;
exports.db = db;
exports.redis = redis;
