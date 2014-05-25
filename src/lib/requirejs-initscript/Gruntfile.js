module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'), 
    copy: {
      build: {
        src: 'src/initscript.js',
        dest: 'build/initscript.js'
      }, 
      sample_regular: {
        src: 'src/initscript.js', 
        dest: 'samples/regular/lib/requirejs-initscript/build/initscript.js'
      }, 
      sample_single: {
        src: 'src/initscript.js', 
        dest: 'samples/single/lib/requirejs-initscript/build/initscript.js'
      },  
      sample_bundle: {
        src: 'src/initscript.js', 
        dest: 'samples/bundle/src/lib/requirejs-initscript/build/initscript.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/initscript.js',
        dest: 'build/initscript.min.js'
      }
    }, 
    requirejs: {
      sample_single: {
        options: {
          optimize: "none",
          baseUrl: "samples/single",
          mainConfigFile: "samples/single/main.js",
          findNestedDependencies: true, 
          out: "samples/single/build.js",
          name: "main"
        }
      }, 
      sample_bundle: {
        options: {
          optimize: "none",
          appDir: 'samples/bundle/src',  
          baseUrl: ".",
          mainConfigFile: "samples/bundle/src/main.js",
          findNestedDependencies: true, 
          dir: "samples/bundle/build", 
          namespace: 'initscriptExample', 
          paths: {
              requireLib: 'lib/requirejs/require'
          },
          modules: [
              {
                  name: "bundle",
                  include: ["requireLib", "main"],
                  //True tells the optimizer it is OK to create
                  //a new file foo.js. Normally the optimizer
                  //wants foo.js to exist in the source directory.
                  create: true
              }
          ]
        }
      }
    }
  });

  // load tasks
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-requirejs');

  // register tasks
  grunt.registerTask('sample_regular', ['copy:sample_regular']);
  grunt.registerTask('sample_single', ['copy:sample_single', 'requirejs:sample_single']);
  grunt.registerTask('sample_bundle', ['copy:sample_bundle', 'requirejs:sample_bundle']);
  
  grunt.registerTask('samples', ['sample_regular', 'sample_single', 'sample_bundle']);
  grunt.registerTask('build', ['copy:build', 'uglify']);
  grunt.registerTask('default', ['build', 'samples']);
  
};