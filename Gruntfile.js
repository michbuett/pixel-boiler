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
        // configure dev updates
        watch: {
            dev: {
                files: ['Gruntfile.js', 'src/**/*', 'tests/**/*'],
                tasks: ['test', 'test-web'],
            },
        },

        connect: {
            dev: {
                options: {
                    livereload: true,
                    // base: 'build/web',
                },
            }
        },

        // ////////////////////////////////////////////////////////////////////
        // configure build
        clean: {
            web: [ 'tmp/*', 'build/web/*' ],
            nw: [ 'tmp/*', 'build/nw/*' ],
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

        exorcise: {
            bundle: {
                options: {},
                files: {
                    'tmp/js/app.map': [
                        'tmp/js/app.js'
                    ],
                }
            }
        },

        uglify: {
            web: {
                files: {
                    'build/web/js/app.js': [ 'tmp/js/app.js' ]
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
                    src: ['src/img/*'],
                    dest: 'build/web/img',
                    expand: true,
                    flatten: true,
                }, {
                    src: ['**'],
                    dest: 'build/web/',
                    cwd: 'tmp/',
                    expand: true,
                }]
            },

            nw: {
                files: [{
                    src: ['src/html/web/index.html'],
                    dest: 'tmp',
                    expand: true,
                    flatten: true,
                }, {
                    src: ['src/css/*'],
                    dest: 'tmp/css',
                    expand: true,
                    flatten: true,
                }, {
                    src: ['src/img/*'],
                    dest: 'tmp/img',
                    expand: true,
                    flatten: true,
                }]
            },
        },

        nwjs: {
            options: {
                appName: 'PixelBOILER',
                platforms: ['win', 'linux'],
                buildDir: 'build/nw',
                version: '0.12.3',
            },
            src: [
                'package.json',
                'tmp/**/*',
            ]
        },
    });

    // load grunt plugins
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.loadNpmTasks('grunt-nw-builder');
    grunt.loadNpmTasks('grunt-exorcise');

    grunt.registerTask('dev', ['connect', 'watch',]);
    grunt.registerTask('test', ['jsonlint', 'jshint', 'jasmine']);
    grunt.registerTask('test-web', ['clean:web', 'sass:dev', 'browserify:web', 'copy:web']);

    grunt.registerTask('build-web', ['clean:web', 'sass:production', 'browserify:web', 'copy:web', 'uglify:web']);
    grunt.registerTask('build-nw', ['clean:nw', 'sass:production', 'browserify:web', 'exorcise', 'copy:nw', 'nwjs']);
    grunt.registerTask('build-all', ['build-web', 'build-nw']);
};
