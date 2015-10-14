/* global module */
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // ////////////////////////////////////////////////////////////////////
        // configure JSHint (documented at http://www.jshint.com/docs/)

        jsonlint: {
            all: {
                src: ['package.json', 'src/**/*.json', 'tests/**/*.json']
            }
        },

        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'tests/spec/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // ////////////////////////////////////////////////////////////////////
        // configure Sass
        sass: {
            production: { // options of the production version
                options: {
                    style: 'compact',
                    sourcemap: 'none',
                },
                files: {
                    'src/css/default.css': 'src/scss/default.scss',
                    'src/css/web.css': 'src/scss/web.scss',
                }
            },
            dev: { // options for the dev version
                options: {
                    style: 'expanded',
                    debugInfo: true,
                    lineNumbers: true,
                    sourcemap: 'file',
                },
                files: {
                    'src/css/default.css': 'src/scss/default.scss',
                    'src/css/web.css': 'src/scss/web.scss',
                }

            }
        },


        // ////////////////////////////////////////////////////////////////////
        // configure unit tests
        jasmine: {
            web: {
                src: [
                    'src/js/core/App.js',
                ],
                options: {
                    specs: 'tests/specs/**/*.spec.js',
                    helpers: [
                        'tests/helper/jquery-2.0.3.js',
                        'tests/helper/**/*.js'
                    ],
                    template: require('grunt-template-jasmine-nml'),
                    keepRunner: true,
                },
            },
        },

        // ////////////////////////////////////////////////////////////////////
        // configure image minifier
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    src: '**/*.png',
                    cwd: 'src/images/',
                    dest: 'src/images/'
                }]
            }
        },

        // ////////////////////////////////////////////////////////////////////
        // configure image minifier
        watch: {
            sass: {
                files: ['src/**/*.scss'],
                tasks: ['sass:dev']
            },

            img: {
                files: ['src/**/*.png'],
                tasks: ['imagemin']
            },

            jasmine: {
                files: ['Gruntfile.js', 'src/**/*', 'tests/**/*'],
                tasks: ['jasmine'],
            },
        },

        nodewebkit: {
            options: {
                appName: 'PixelBoiler',
                platforms: ['win', 'linux32', 'linux64'],
                buildDir: 'builds/nw',
            },
            src: [
                'package.json',
                'src/nw-app.html',
                'src/css/*.css',
                'src/js/**/*.js',
                'src/img/**/*',
            ]
        },
    });


    // load grunt plugins
    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    //grunt.loadNpmTasks('grunt-contrib-copy');
    //grunt.loadNpmTasks('grunt-contrib-cssmin');
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-node-webkit-builder');


    grunt.registerTask('test', ['jsonlint', 'jshint', 'jasmine']);

    grunt.registerTask('dev', ['sass:dev']);

    grunt.registerTask('build', ['sass:production']);
    grunt.registerTask('buildnw', ['sass:production', 'nodewebkit']);
};
