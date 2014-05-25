module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'), 
    jshint: {
      all: [
          "Gruntfile.js", 
          //"src/**/*.js"
      ], 
      options: {
        jshintrc: '.jshintrc'
      }
    },
    copy: {
      build: {
        src: 'src/elopts.js',
        dest: 'build/elopts.js'
      }
    }, 
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/elopts.js',
        dest: 'build/elopts.min.js'
      }
    }, 
    jasmine: {
      test: {
        src: 'src/**/*.js',
        options: {
          specs: 'spec/javascripts/*Spec.js', 
          vendor: 'spec/vendor/jquery/jquery.js', 
          helpers: 'spec/javascripts/helpers/*.js'
        }
      }
    }
  });

  // load tasks
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  
  grunt.registerTask('test', ['jshint', 'jasmine']);

  grunt.registerTask('build', ['copy', 'uglify']);
  grunt.registerTask('default', ['build']);
  
};