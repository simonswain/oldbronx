var express = require('express');
var http = require('http');
var fs = require('fs');

var piler = require("piler");
var clientjs = piler.createJSManager();
var clientcss = piler.createCSSManager();

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

if(app.config.env === 'production') {
}

if(app.config.env === 'staging') {
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
  app.use(express.logger('dev'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.locals.pretty = true;
}

if(app.config.env === 'test') {
}


app.configure(function(){

  app.disable('x-powered-by');

  app.set('views', __dirname + '/cache/views');
  app.set('view engine', 'jade');

  app.use(express.favicon(__dirname + '/public/images/favicon.ico'));

  clientjs.bind(app, server);
  clientcss.bind(app,server);

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

var modules_dir = __dirname + '/../modules';
var cache_dir = __dirname + '/cache';
var views_dir = cache_dir + '/views';

if(!fs.existsSync(cache_dir)) {
  fs.mkdir(cache_dir);
}

if(!fs.existsSync(views_dir)) {
  fs.mkdir(views_dir);
}

if(!fs.existsSync(views_dir + '/includes')) {
  fs.mkdir(views_dir + '/includes');
}

if(!fs.existsSync(views_dir + '/layouts')) {
  fs.mkdir(views_dir + '/layouts');
}

fs.readdirSync(__dirname + '/views').forEach(function(f) {

  if ( f.substr(0,1) === '.' ) {
    return;
  }
 
 var stats = fs.statSync(__dirname + '/views/' + f);
  if (stats.isFile()) {
    fs.createReadStream(__dirname + '/views/' + f)
      .pipe(fs.createWriteStream(views_dir + '/' + f));
  };

});

fs.readdirSync(__dirname + '/views/layouts').forEach(function(f) {

  if ( f.substr(0,1) === '.' ) {
    return;
  }

  var stats = fs.statSync(__dirname + '/views/layouts/' + f );
  if (stats.isFile()) {
    fs.createReadStream(__dirname + '/views/layouts/' + f)
      .pipe(fs.createWriteStream(views_dir + '/layouts/' + f));
  };

});

fs.readdirSync(__dirname + '/views/includes/').forEach(function(f) {

  if ( f.substr(0,1) === '.' ) {
    return;
  }

  var stats = fs.statSync(__dirname + '/views/includes/' + f );
  if (stats.isFile()) {
    fs.createReadStream(__dirname + '/views/includes/' + f)
      .pipe(fs.createWriteStream(views_dir + '/includes/' + f));
  };

});

fs.readdirSync(modules_dir).forEach(function(folder) {

  if ( folder.substr(0,1) === '.' ) {
    return;
  }

  var stats = fs.statSync(modules_dir + '/' + folder);

  if (!stats.isDirectory()) {
    return;
  }

  if(fs.existsSync(modules_dir + '/' + folder + '/routes.js')) {

    if(fs.existsSync(modules_dir + '/' + folder + '/css/style.css')) {
      clientcss.addFile(folder, modules_dir + '/' + folder + '/css/style.css');
    }

    if(fs.existsSync(modules_dir + '/' + folder + '/js/script.js')) {
      clientjs.addFile(folder, modules_dir + '/' + folder + '/js/script.js');
    }

    var bro = {
      render: function(req, res, view, options){
        options.js = clientjs.renderTags(folder);
        options.css =clientcss.renderTags(folder);

        view = folder + '-' + view;
        return res.render(view, options);
      }
    };
    require(modules_dir + '/' + folder + '/routes.js')(app, bro);
  }

  if(!fs.existsSync(modules_dir + '/' + folder + '/views')) {
    return;
  }

  fs.readdirSync(modules_dir + '/' + folder + '/views').forEach(function(f) {
    var stats = fs.statSync(modules_dir + '/' + folder + '/views/' + f);
    if (!stats.isFile()) {
      return;
    };
    fs.createReadStream(modules_dir + '/' + folder + '/views/' + f)
      .pipe(fs.createWriteStream(views_dir + '/' + folder + '-' + f));
  });

  return;
  
});


// default route...
//app.get('*', default);


//routes = require('./routes')(app);

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
