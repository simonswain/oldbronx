'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      files: ['test/**/*_test.js'],
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      },
    },
    env : {
      dev : {
        NODE_ENV : 'dev'
      },
      test : {
        NODE_ENV : 'test'
      },
      stage : {
        NODE_ENV : 'stage'
      },
      production : {
        NODE_ENV : 'production'
      }
    },
    bower: {
      install: {
        //just run 'grunt bower:install' and you'll see files from
        //your Bower packages in lib directory
      },
      options: {
        targetDir: './server/public/vendor',
        cleanTargetDir: false,
        cleanBowerDir: true,
        layout: 'byComponent',
        install: true,
        verbose: true
      }
    },
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-bower-task');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['env:test', 'jshint', 'nodeunit']);

  // Default task.
  grunt.registerTask('default', ['test']);

};
