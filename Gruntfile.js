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
                    out: './docs',
                    name: 'pilasengine.js',
                    target: 'es5'
                },
                src: ['./src/**/*']
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
            options: {
              livereload: true,
            },
            files: ['src/**/*.ts', 'test/**', 'public/test.html'],
            tasks: ['typescript', 'test']
        },
        open: {
            dev: {
                path: 'http://localhost:8080/public/test.html'
            }
        }
    });


    grunt.loadNpmTasks('grunt-typedoc');
    grunt.registerTask('test', ['qunit']);
    grunt.registerTask('default', ['connect', 'typedoc', 'open', 'watch']);

}
