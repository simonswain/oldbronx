var express = require('express');
var http = require('http');

var bronx = require('../lib/bronx');

var server;
var routes = {};

var app = express();
app.bronx = bronx;
app.config = bronx.config;

app.passport = require('passport');
app.LocalStrategy = require('passport-local').Strategy;
app.port = app.config.port;

exports.app = app;

var RedisStore = require('connect-redis')(express);
var lessMiddleware = require('less-middleware');
var BundleUp = require('bundle-up');

if(app.config.env === 'production') {
  BundleUp(app, __dirname + '/assets', {
    staticRoot: __dirname + '/public/',
    staticUrlRoot:'/',
    bundle: true,
    minifyCss: true,
    minifyJs: true
  });
}

if(app.config.env === 'staging') {
  BundleUp(app, __dirname + '/assets', {
    staticRoot: __dirname + '/public/',
    staticUrlRoot:'/',
    bundle: true,
    minifyCss: true,
    minifyJs: true
  });
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(express.logger('tiny'));
}

if(app.config.env === 'dev') {
  console.log(bronx.config.name + ' - dev');
  app.use(lessMiddleware({
    force: true,
    prefix: '/css',
    src: __dirname + '/public/less',
    dest: __dirname + '/public/css',
  }));
  BundleUp(app, __dirname + '/assets', {
    staticRoot: __dirname + '/public/',
    staticUrlRoot:'/',
    bundle: false,
    minifyCss: false,
    minifyJs: false
  });
  app.use(express.logger('dev'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.locals.pretty = true;
}

if(app.config.env === 'test') {
  BundleUp(app, __dirname + '/assets', {
    staticRoot: __dirname + '/public/',
    staticUrlRoot:'/',
    bundle: false,
    minifyCss: false,
    minifyJs: false
  });
}


app.configure(function(){

  app.disable('x-powered-by');

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.favicon(__dirname + '/public/images/favicon.ico'));

  app.use('/js', express.static(__dirname + '/public/vendor'));
  app.use('/bootstrap', express.static(__dirname + '/public/bootstrap'));
  app.use(express.static(__dirname + '/public'));

  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.bodyParser());

  // catch malformed json
  app.use(clientErrorHandler = function(err, req, res, next) {
    if (err) {
      console.log('ERROR', err);
      res.writeHead(400);
      res.end('Invalid Request');
    } else {
      next();
    }
  });
  
  app.use(express.session({ secret: app.config.secret, store: new RedisStore }));
  app.use(app.passport.initialize());
  app.use(app.passport.session());

  app.use(app.router);

});

// passport auth

app.passport.use(new app.LocalStrategy(
  function(username, password, done) {
    var user = false;
    app.bronx.users.auth(username, password, function(err, user){
      if (err) {
        return done(err);
      }
      if ( ! user ) {
        return done(null, false, {message: 'Invalid Login'});
      }
      return done(null, user);
    });
  }
));

app.passport.serializeUser(function(user, done) {
  done(null, user.id);
});

app.passport.deserializeUser(function(id, done) {
  app.bronx.users.get(id, function(err, user){
    if (err) {
      return done(null, false);
    }
    done(err, user);
   });
});


routes = require('./routes')(app);

exports.start = function(done){
  server = require('http').createServer(app);
  server.listen(
    app.port,
    function() {
      // console.log(
      //   app.config.name + " starting on port %d in %s mode",
      //   app.port,
      //   app.config.env
      // );
      if(done){
        done();
      }
    });
}

exports.stop = function(done){
  server.close(function(){
    if(done){
      done();
    }
  });
}
