'use strict';

module.exports = function(app){

  app.get('/logout', function(req, res){
    req.logOut();
    res.redirect('/');
  });

};
