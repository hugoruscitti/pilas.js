module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');

    grunt.initConfig({
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
                dest: 'public/js/test.js',
                options: {
                    module: 'CommonJS',
                    target: 'es5'
                }
            }
        },
        watch: {
            options: {
              livereload: true,
            },
            files: 'src/**/*.ts',
            tasks: ['typescript']
        },
        open: {
            dev: {
                path: 'http://localhost:8080/public/test.html'
            }
        }
    });

    grunt.registerTask('default', ['connect', 'open', 'watch']);

}
