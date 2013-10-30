// Karma configuration
// Generated on Wed Oct 30 2013 16:21:06 GMT+1300 (NZDT)

module.exports = function(config) {
  'use strict';

  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['mocha', 'chai'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/jquery/jquery.js',
      'bower_components/underscore/underscore.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/ngstorage/ngStorage.js',
      'js/*.js',
      'js/**/*.js',
      'test/unit/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['ChromeCanary'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
