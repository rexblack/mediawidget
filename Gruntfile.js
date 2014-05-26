
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'), 
    string: require('string'), 
    bundle_name: "p", 
    bundle_namespace: "<%= string(pkg.name).camelize().replace(/^([\\d]+)/, '_$1') %>", 
    css_name: "<%= string(pkg.name).slugify().replace(/^([\\d]+)/, '_$1') %>", 
    copy: {
      compile: {
        cwd: 'src', 
        src: [
          // clean up bower components
          '**', 
          '!**/Gruntfile.js',
          '!**/package.json',
          '!**/bower.json',
          '!**/*.md',
          '!**/*.mdown',
          '!**/*.min.map', 
          '!**/*.min.js',
          '!**/*LICENSE*',
          '!lib/**/samples/**',
          '!lib/**/examples/**',  
          '!lib/**/src/**', 
          '!lib/**/lib/**', 
          '!lib/**/demo/**',  
          '!lib/**/test/**', 
          '!lib/**/spec/**', 
          '!lib/**/vendor/**', 
          'lib/requirejs-plugins/src/**'
        ], 
        dest: 'tmp', 
        expand: true
      }
    }, 
    css_datauri: {
      compile: {
        files: [
          {
            expand: true, 
            cwd: 'tmp', 
            src: ['**/*.css'], 
            dest: 'tmp'
          }
        ]
      }
    },
    css_wrap: {
      compile: {
        files: [
          {
            expand: true, 
            cwd: 'tmp', 
            src: ['**/*.css'], 
            dest: 'tmp'
          }
        ], 
        options: { 
          selector: ".<%= css_name %>"
        }
      }
    },
    amd_shim: {
      jquery: {
        src: 'tmp/lib/jquery/dist/jquery.js', 
        dest: 'tmp/lib/jquery/dist/jquery.js', 
        options: { 
          global: ['$', 'jQuery']
        }
      }, 
      mediaelement: {
        src: 'tmp/lib/mediaelement/build/mediaelement-and-player.js', 
        dest: 'tmp/lib/mediaelement/build/mediaelement-and-player.js', 
        options: {
          dep: {
            jquery: '$'
          }, 
          globals: {'mejs': 'mejs_mediawidget', 'MediaElement': ''}, 
          exports: 'mejs'
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          optimize: "none",
          appDir: 'tmp',  
          baseUrl: ".",
          mainConfigFile: "tmp/main.js",
          findNestedDependencies: true, 
          buildCSS: true, 
          removeCombined: true, 
          preserveLicenseComments: false, 
          dir: "build", 
          namespace: "<%= bundle_namespace %>", 
          paths: {
              requireLib: 'lib/requirejs/require'
          },
          modules: [
              {
                  name: "<%= bundle_name %>",
                  include: ["requireLib", "main"],
                  //True tells the optimizer it is OK to create
                  //a new file foo.js. Normally the optimizer
                  //wants foo.js to exist in the source directory.
                  create: true
              }
          ], 
          onBuildRead: function (moduleName, path, contents) {
            // process contents as grunt template
            grunt.template.addDelimiters('requirejs', '<%g', '%>');
            contents = grunt.template.process(contents, {
              delimiters: 'requirejs', 
              data: grunt.config()
            });
            return contents;
          }, 
        }
      }
    }, 
    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '/*! <%= string(pkg.name).humanize() %>\n *\n * version: <%= pkg.version %>\n * built at <%= grunt.template.today("dd-mm-yyyy HH:MM:ss") %>\n */\n'
      },
      dist: {
        files: {
          'build/<%= bundle_name %>.js': ['<%= requirejs.compile.options.dir %>/<%= bundle_name %>.js']
        }
      }
    }, 
    clean: {
      tmp: {
        src: 'tmp', 
        build: ''
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-css-prefix');
  grunt.loadNpmTasks('grunt-css-wrap');
  grunt.loadNpmTasks('grunt-css-datauri');
  grunt.loadNpmTasks('grunt-amd-shim');
  
  grunt.registerTask('default', [
    'clean:tmp', 
    'copy:compile', 
    'amd_shim', 
    'css_wrap:compile', 
    'css_datauri', 
    'requirejs:compile',
    'uglify',  
    //'clean:tmp'
  ]);
};