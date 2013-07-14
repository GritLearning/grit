module.exports = function(grunt) {
  'use strict';

  // Load grunt plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Project configuration.
  grunt.initConfig({

    // Concatenate & minify JS. see https://github.com/gruntjs/grunt-contrib-uglify
    uglify: {
      build: {
        // The order that the files appear here is the order they are concatenated in
        src: [
          'js/libs/jquery-1.9.1.js',
          'js/libs/cordova-2.5.0.js',
          'js/libs/angular/angular.js',
          'js/libs/angular/angular-resource.js',
          'js/libs/bootstrap-button.js',
          'js/libs/bootstrap-modal.js',
          'js/app.js',
          'js/index.js',
          'js/services.js',
          'js/controllers.js',
          'js/filters.js',
          'js/directives.js'
        ],
        dest: 'js/all.min.js'
      }
    }
  });

  // Set default task (the task to run when you invoke grunt without a specific task) 
  grunt.registerTask('default', ['uglify']);
};
