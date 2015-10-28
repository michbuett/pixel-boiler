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
            files: [
                'Gruntfile.js',
                'src/**/*.js',
                'tests/specs/**/*.js',
                'tests/helper/**/*.js',
            ],
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
                    'tmp/css/main.css': 'src/scss/main.scss',
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
                    'tmp/css/main.css': 'src/scss/main.scss',
                }

            }
        },


        // ////////////////////////////////////////////////////////////////////
        // configure unit tests
        jasmine: {
            options: {
                specs: 'tests/specs/**/*.spec.js',
                helpers: [
                    'tests/helper/**/*.js',
                ],
                vendor: [
                    'tests/vendor/jquery-2.0.3.js',
                    'tests/vendor/**/*.js'
                ],
            },

            web: {
                src: [
                    'src/js/core/App.js',
                ],
                options: {
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
                    dest: 'tmp/images/'
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

            js: {
                files: ['Gruntfile.js', 'src/**/*', 'tests/**/*'],
                tasks: ['test'],
            },
        },


        // ////////////////////////////////////////////////////////////////////
        // configure build
        clean: {
            web: [ 'tmp/*', 'build/web/*' ],
        },

        browserify: {
            web: {
                src: [
                    'src/js/web/init.js',
                ],
                dest: 'tmp/js/app.js',
                options: {
                    browserifyOptions: {
                        debug: true,
                    },
                }
            },
        },

        uglify: {
            web: {
                files: {
                    'build/web/js/app.js': [ 'tmp/**/*.js' ]
                }
            },
        },

        copy: {
            web: {
                files: [{
                    src: ['src/html/web/index.html'],
                    dest: 'build/web',
                    expand: true,
                    flatten: true,
                }, {
                    src: ['src/css/*'],
                    dest: 'build/web/css',
                    expand: true,
                    flatten: true,
                }, {
                    src: ['**'],
                    dest: 'build/web/',
                    cwd: 'tmp/',
                    expand: true,
                }]
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
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.loadNpmTasks('grunt-node-webkit-builder');


    grunt.registerTask('test', ['jsonlint', 'jshint', 'jasmine']);

    grunt.registerTask('test-web', ['clean:web', 'sass:dev', 'browserify:web', 'copy:web']);
    // grunt.registerTask('build-web', ['clean:web', 'sass:production', 'browserify:web']);
};
