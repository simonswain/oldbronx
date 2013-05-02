'use strict';

var reset = require('../db/reset.js');

module.exports = function(grunt) {
  grunt.registerTask('reset', 'Resets database to pristine state', function() {
    var done = this.async();
    reset(done);
  });

}
