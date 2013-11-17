/* global module */
module.exports = function (grunt) {
  'use strict';

  // TODO
  // * don't pull in all of bower_components
  // * run JS through a concatenation and/or minificaiton step
  // * don't pull in all of the content folder

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
    // 'jshint',
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
      buildDir : './www',
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
          { src: ['content/**'], dest: '<%= options.buildDir %>/' },
          { src: ['bower_components/**'], dest: '<%= options.buildDir %>/' }
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
          { src: ['js/**'], dest: '<%= options.buildDir %>/' }
        ]
      }
    },

    // The watcher is tuned for the development environment on the web platform
    // as that is where we use it.
    watch: {
      assets: {
        files: [
          // the no. of image files in content overwhelms the grunt watcher so
          // we leave it out.
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
};
