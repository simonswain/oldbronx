// assets for bundle-up

module.exports = function(assets) {

  assets.root = __dirname;

  assets.addJs('/public/vendor/jquery/jquery.js');

  assets.addCss('/public/vendor/bootstrap/css/bootstrap.css');
  assets.addCss('/public/vendor/bootstrap/css/bootstrap-responsive.css');
  assets.addJs('/public/vendor/bootstrap/js/bootstrap.js');

  assets.addJs('/public/js/app.js');


}
