/* global module */
module.exports = function (grunt) {
  'use strict';

  /*
   * We have 4 types of content that make up our project:
   *  1. html
   *  2. css
   *  3. js
   *  4. assets (sounds, fonts, imgs etc.)
   *
   * We build the project in 2 phases:
   *  1. generate any files that need to be built (e.g. scss) into the temporary dir (./.tmp by default)
   *  2. copy the contents of the tmp dir to the build outputs dir (./www by default)
   *
   * We have a separate task for each phase of each content-type. This gives us
   * maximum flexibility over how the tasks are setup.
   */

  grunt.registerTask('default', [
    'setup',        // always first step
    'jshint',
    'clean',
    'sass:dev',
    // 'buildjs',
    'copy'          // always last step
  ]);

  grunt.registerTask('setup', 'Setup Grunt Configuration', function () {
    var envRE = /^(development|production)$/;
    var platformRE = /^(android|ios|web)$/;

    if (grunt.option('env')) {
      if (envRE.test(grunt.option('env'))) {
        grunt.config('options.env', grunt.option('env'));
      }
      else {
        grunt.fail.fatal('I do not recognise the environment you requested: ' + grunt.option('env'));
      }
    }
    else {
      grunt.config('options.env', grunt.config('defaults.env'));
    }

    if (grunt.option('platform')) {
      if (platformRE.test(grunt.option('platform'))) {
        grunt.config('options.platform', grunt.option('platform'));
      }
      else {
        grunt.fail.fatal('I do not recognise the platform you requested: ' + grunt.option('platform'));
      }
    }
    else {
      grunt.config('options.platform', grunt.config('defaults.platform'));
    }

    if (grunt.option('build-dir')) {
      grunt.config('options.buildDir', grunt.option('build-dir'));
    }
    else {
      grunt.config('options.buildDir', grunt.config('defaults.buildDir'));
    }

    grunt.log.writeflags(grunt.config('options'), 'Options For This Run');
  });

  grunt.initConfig({

    // Setup safe fallback build options in case we did not get any from
    // command line
    defaults: {
      buildDir : '../www',
      env      : 'development',
      platform : 'web',
      tmpDir   : './.tmp'
    },

    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          // 'destination': 'source'
          '<%= defaults.tmpDir %>/style.css': 'scss/style.scss'
        }
      },
      dev: {
        options: {
          style: 'expanded',
          lineComments: true
        },
        files: {
          // 'destination': 'source'
          '<%= defaults.tmpDir %>/style.css': 'scss/style.scss'
        }
      }
    },

    // We are being explicit about what we are deleting because this task can
    // potentially delete *any* file on the system that you have permissions on.
    // Scary.
    clean: {
      tmp: ['<%= defaults.tmpDir %>/*'],
      assets: {
        src: [
          '<%= options.buildDir %>/fonts',
          '<%= options.buildDir %>/content',
          '<%= options.buildDir %>/bower_components',
          '<%= options.buildDir %>/img'
        ],
        options: { force: true }
      },
      js: {
        src: [ '<%= options.buildDir %>/js' ],
        options: { force: true }
      },
      xml: {
        src: [ '<%= options.buildDir %>/config.xml' ],
        options: { force: true }
      },
      html: {
        src: [ '<%= options.buildDir %>/index.html' ],
        options: { force: true }
      },
      views: {
        src: [ '<%= options.buildDir %>/views' ],
        options: { force: true }
      },
      css: {
        src: [ '<%= options.buildDir %>/css' ],
        options: { force: true }
      }
    },

    copy: {
      assets: {
        files: [
          { src: ['img/**'], dest: '<%= options.buildDir %>/' },
          { src: ['content/locales/**'], dest: '<%= options.buildDir %>/' },
          { src: ['content/apps/**'], dest: '<%= options.buildDir %>/' }
        ]
      },
      xml: {
        files: [
          { src: ['config.xml'], dest: '<%= options.buildDir %>/config.xml' }
        ]
      },
      html: {
        files: [
          { src: ['index.html'], dest: '<%= options.buildDir %>/index.html' }
        ]
      },
      fonts: {
        files: [
          { src: ['fonts/**'], dest: '<%= options.buildDir %>/' }
        ]
      },
      views: {
        files: [
          { src: ['views/**'], dest: '<%= options.buildDir %>/' }
        ]
      },
      css: {
        files: [
          { src: ['<%= defaults.tmpDir %>/style.css'], dest: '<%= options.buildDir %>/css/style.css' }
        ]
      },
      js: {
        files: [
          { src: ['js/**'], dest: '<%= options.buildDir %>/' },
          // Option A: copy everything from bower_components to the build directory
          // { src: ['bower_components/**'], dest: '<%= options.buildDir %>/' }

          // Option B: cherry pick just what we need from bower_components to
          // the build directory. This is quite brittle but only a temporary
          // measure until we get concatenation & minification sorted out.
          {
            src: [
              'bower_components/normalize-css/normalize.css',
              'bower_components/jquery/jquery.js',
              'bower_components/underscore/underscore.js',
              'bower_components/angular/angular.js',
              'bower_components/angular-resource/angular-resource.js',
              'bower_components/angular-route/angular-route.js',
              'bower_components/angular-touch/angular-touch.js',
              'bower_components/angular-animate/angular-animate.js',
              'bower_components/ngstorage/ngStorage.js',
            ],
            dest: '<%= options.buildDir %>/'
          }
        ]
      }
    },

    jshint: {

      options: {
        jshintrc: true,
        ignores: ['js/libs/**/*.js']
      },

      all: ['Gruntfile.js', 'js/**/*.js']
    },

    // The watcher is tuned for the development environment on the web platform
    // as that is where we use it.
    watch: {
      assets: {
        files: [
          // the large number of image files in content overwhelms the grunt
          // watcher so we leave it out. In practice, this has not caused many
          // issues because content does not change very often during
          // development
          // 'content/**',
          'img/**',
          'bower_components/**'
        ],
        tasks: ['setup', 'copy:assets']
      },

      css: {
        files: ['scss/**/*.scss'],
        tasks: ['setup', 'sass:dev', 'copy:css']
      },

      views: {
        files: ['views/**', 'index.html'],
        tasks: ['setup', 'copy:views']
      },

      js: {
        files: ['js/**/*.js'],
        tasks: ['setup', 'copy:js']
      }
    },

    protractor: {
      // Docs: https://npmjs.org/package/grunt-protractor-runner
      all: {
        configFile: 'test/protractor.conf.js', // Target-specific config file
      }
    },

    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }
  });

  // alias task names for less typing
  grunt.registerTask('unit', ['karma:unit']);
  grunt.registerTask('e2e', ['protractor:all']);
  grunt.registerTask('test', ['unit', 'e2e']);

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-karma');
};
