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
    }
  });

  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['react', 'browserify']);

};