/*global Backbone:true,  _:true, $:true, App:true */
/*jshint browser:true */
/*jshint strict:false */

$(function() {

  var auth = {
    login: function(user, success, failure) {
      var self = this;
      $.ajax({
        type: 'POST',
        url: '/api/sign-in',
        data: user
      }).done(success)
        .fail(failure);
    },
    signup: function(user, success, failure) {
      var self = this;
      $.ajax({
        type: 'POST',
        url: '/api/sign-up',
        data: user
      }).done(function(res) {
        self.login(user, success);
      }).fail(failure);
    }
  };

  $('form.sign-in').on('submit', function(e) {

    e.preventDefault();
    e.stopPropagation();

    var el = $(this);
    el.find('.error').removeClass('error');

    var user = {
      username: el.find('[name=username]').val(),
      password: el.find('[name=password]').val()
    };
 
    var valid = true;

    if (!user.username){
      el.find('[name=username]')
        .parents('.control-group:first')
        .addClass('error');
      valid = false;
    }


    if (!user.password){
      el.find('[name=password]')
        .parents('.control-group:first')
        .addClass('error');
      valid = false;
    }

    if(!valid){
      return false;
    }

    auth.login(user, function(user) {
      window.location.href='/';
    }, function(res) {

      el.find('[name=username]')
        .parents('.control-group:first')
        .addClass('error');
      valid = false;

      el.find('[name=password]')
        .parents('.control-group:first')
        .addClass('error');
      
    });    

  });


  $('form.sign-up').on('submit', function(e) {

    e.preventDefault();
    e.stopPropagation();

    var el = $('form.sign-up');
    el.find('.error').removeClass('error');
    
    this.isEmail = function(email) {
      var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      return regex.test(email);
    }
 
    var user = {
      email: el.find('[name=email]').val(),
      username: el.find('[name=username]').val(),
      password: el.find('[name=password]').val()
    };

    var valid = true;

    if (!user.username){
      el.find('[name=username]')
        .parents('.control-group:first')
        .addClass('error');
      valid = false;
    }


    if (!user.password){
      el.find('[name=password]')
        .parents('.control-group:first')
        .addClass('error');
      valid = false;
    }

    if (!this.isEmail(user.email)){
      el.find('[name=email]')
        .parents('.control-group:first')
        .addClass('error');
      valid = false;
    }

    if(!valid){
      return false;
    }

    auth.signup(
      user, 
      function(res) {
        window.location.href='/';
      }, 
      function(res) {

        var err = JSON.parse(res.responseText);

        if(err.email){
          el.find('[name=email]')
            .parents('.control-group:first')
            .addClass('error');
        }

        if(err.username){
          el.find('[name=username]')
            .parents('.control-group:first')
            .addClass('error');
        }

        if(err.username_unavailable){
          el.find('[name=username]')
            .parents('.control-group:first')
            .addClass('error');
        }

        if(err.password){
          el.find('[name=password]')
            .parents('.control-group:first')
            .addClass('error');
        }

      });    
  });

});
