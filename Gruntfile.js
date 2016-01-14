module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    grunt.initConfig({
        typedoc: {
            build: {
                options: {
                    module: 'commonjs',
                    out: './docs/dist',
                    name: 'pilasengine.js',
                    target: 'es5',
                    readme: './docs/homepage.md'
                },
                src: ['./src/**/*', 'public/data/**/*']
            }
        },
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: './'
                }
            }
        },
        typescript: {
            base: {
                src: ['src/**/*.ts'],
                dest: 'public/js/pilasengine.js',
                options: {
                    module: 'CommonJS',
                    removeComments: false,
                    target: 'es5'
                }
            }
        },
        qunit: {
          files: ['test/index.html']
        },
        watch: {
          withTests: {
            options: {
              livereload: true,
            },
            files: ['src/**/*.ts', 'test/**', 'public/ejemplos/**'],
            tasks: ['typescript', 'test']
          },
          withNoTests: {
            options: {
              livereload: true,
            },
            files: ['src/**/*.ts', 'test/**', 'public/ejemplos/**'],
            tasks: ['typescript']
          }
        },
        open: {
            dev: {
                path: 'http://localhost:8080/public/ejemplos/'
            }
        }
    });


    grunt.registerTask('message', 'Muestra que url se tiene que abrir.', function(arg) {
      var msg = 'La aplicación está funcionando en: http://localhost:8080/public/ejemplos';
      grunt.log.ok(msg);
    });


    grunt.loadNpmTasks('grunt-typedoc');

    grunt.registerTask('test', ['qunit']);
    grunt.registerTask('default', ['connect', 'typescript', 'typedoc', 'test', 'message', 'watch":withTests']);
    grunt.registerTask('defaultFast', ['connect', 'typescript', 'message', 'watch:withNoTests']);

    grunt.registerTask('only-build', ['typescript', 'typedoc', 'test']);
}
