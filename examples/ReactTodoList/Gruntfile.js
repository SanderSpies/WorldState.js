module.exports = function(grunt) {

  grunt.initConfig({
    browserify: {
      dist: {
        files: {
          'build/bundle.js': ['build/ApplicationComponent.js']
        }
      }
    },
    react: {
      all: {
        files: [
          {
            expand: true,
            cwd: 'Components/',
            src: ['*.js'],
            dest: 'build',
            ext: '.js'
          }
        ]
      }
    },
    closurecompiler: {
      minify: {
        files: {
          'build/bundle.js':'build/bundle.js'
        },
        options: {
          "compilation_LEVEL": "ADVANCED_OPTIMIZATIONS"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-closurecompiler');

  grunt.registerTask('default', ['react', 'browserify']);

};