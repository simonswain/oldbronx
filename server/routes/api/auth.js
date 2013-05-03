'use strict';

var _ = require('underscore');

var response = require('./response.js');

var auth_priv = module.exports.priv = function (user, priv) {

  if(!user || typeof user !== 'object'){
    return false;
  }

  if ( typeof priv === 'undefined' ) {
    return true;
  }

  return _.contains(user.privs, priv);

};

// auth for user logged in by session
module.exports.user = function (priv) {
  
  return function(req, res, next) {
    
    if (!req.user) {
      return response.unauthorized(res);
    }
    
    if (auth_priv(req.user, priv)) {
      return next();            
    }

    return response.unauthorized(res);
  };
};
