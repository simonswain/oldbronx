var express = require('express');
var http = require('http');
var fs = require('fs');
var piler = require("piler");
var less = require('less-middleware');
var validator = require('express-validator');

module.exports = function(bronx){

  var clientjs = piler.createJSManager();
  var clientcss = piler.createCSSManager();

  var server;
  var routes = {};

  var app = express();
 app.passport = require('passport');
  app.LocalStrategy = require('passport-local').Strategy;

  var RedisStore = require('connect-redis')(express);

  if(bronx.config.env === 'production') {
  }

  if(bronx.config.env === 'staging') {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(express.logger('tiny'));
  }

  if(bronx.config.env === 'dev') {
    app.use(less({
      force: true,
      prefix: '/css',
      src: __dirname + '/public/less',
      dest: __dirname + '/public/css',
    }));
    app.use(express.logger('dev'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.locals.pretty = true;
  }

  if(bronx.config.env === 'test') {
  }

  app.configure(function(){

    app.disable('x-powered-by');

    app.set('views', bronx.root + '/cache/views');
    app.set('view engine', 'jade');

    app.use(express.favicon(__dirname + '/public/images/favicon.ico'));

    clientjs.bind(app, server);
    clientcss.bind(app,server);

    app.use('/js', express.static(__dirname + '/public/vendor'));

    app.use('/bootstrap', express.static(__dirname + '/public/bootstrap'));
    app.use(express.static(__dirname + '/public'));
    //    app.use(express.static(bronx.root + '/public'));

    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(validator());

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
    
    app.use(express.session({ secret: bronx.config.secret, store: new RedisStore }));
    app.use(app.passport.initialize());
    app.use(app.passport.session());

    app.use(app.router);

  });

  // passport auth

  app.passport.use(new app.LocalStrategy(
    function(username, password, done) {
      var user = false;
      bronx.users.auth(username, password, function(err, user){
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
    bronx.users.get(id, function(err, user){
      if (err) {
        return done(null, false);
      }
      done(err, user);
    });
  });

  var modules_dir = bronx.root + '/modules';
  var cache_dir = bronx.root + '/cache';
  var views_cache = bronx.root + '/cache/views';

  if(!fs.existsSync(cache_dir)) {
    fs.mkdir(cache_dir);
  }

  if(!fs.existsSync(views_cache)) {
    fs.mkdir(views_cache);
  }

  if(!fs.existsSync(views_cache + '/includes')) {
    fs.mkdir(views_cache + '/includes');
  }

  if(!fs.existsSync(views_cache + '/layouts')) {
    fs.mkdir(views_cache + '/layouts');
  }

  fs.readdirSync(bronx.root + '/views').forEach(function(f) {

    if ( f.substr(0,1) === '.' ) {
      return;
    }
    
    var stats = fs.statSync(bronx.root + '/views/' + f);
    if (stats.isFile()) {
      fs.createReadStream(bronx.root + '/views/' + f)
        .pipe(fs.createWriteStream(views_cache + '/' + f));
    };

  });

  fs.readdirSync(bronx.root + '/views/layouts').forEach(function(f) {

    if ( f.substr(0,1) === '.' ) {
      return;
    }

    var stats = fs.statSync(bronx.root + '/views/layouts/' + f );
    if (stats.isFile()) {
      fs.createReadStream(bronx.root + '/views/layouts/' + f)
        .pipe(fs.createWriteStream(views_cache + '/layouts/' + f));
    };

  });

  fs.readdirSync(bronx.root + '/views/includes/').forEach(function(f) {

    if ( f.substr(0,1) === '.' ) {
      return;
    }

    var stats = fs.statSync(bronx.root + '/views/includes/' + f );

    console.log(':' + bronx.root + '/views/includes/' + f);

    if (stats.isFile()) {
      fs.createReadStream(bronx.root + '/views/includes/' + f)
        .pipe(fs.createWriteStream(views_cache + '/includes/' + f));
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

      var view = {        
        render: function(req, res, view, options){
          options.js = clientjs.renderTags(folder);
          options.css = clientcss.renderTags(folder);
          view = folder + '-' + view;
          return res.render(view, options);
        }
      };
      require(modules_dir + '/' + folder + '/routes.js')(app, bronx, view);
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
        .pipe(fs.createWriteStream(views_cache + '/' + folder + '-' + f));
    });

    return;
    
  });
  

  return {
    app: app,
    start: function(done){
      server = require('http').createServer(app);
      server.listen(
        bronx.config.port,
        function() {
          //console.log(bronx.config.name, bronx.config.env);
          console.log(
            bronx.config.name + " starting on port %d in %s mode",
            bronx.config.port,
            bronx.config.env
          );
          if(done){
            done();
          }
        });
    },
    stop: function(done){
      server.close(function(){
        if(done){
          done();
        }
      });
    }
  }

}
