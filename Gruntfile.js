module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
            js: {
                options: {
                    mainConfigFile: 'js/requireConfig.js',
                    baseUrl: 'js/',
                    name: 'app',

                    out: 'app-min.js',

                    optimize: 'uglify2',
                    generateSourceMaps: true,
                    preserveLicenseComments: false
                }
            },
            css: {
                options: {
                    baseUrl: 'css/',
                    optimizeCss: 'standard.keepLines',
                    cssIn: 'app.css',
                    out: 'app-min.css'
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // Default task(s).
    grunt.registerTask('default', ['requirejs']);

};