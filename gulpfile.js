'use strict';

var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    jasmine = require('gulp-jasmine');

gulp.task('test', function(){
  gulp.src([
      'tests/BaseTests.js',
      'tests/GeneratedFilesTests.js',
      'tests/ReactWorldStateMixinTests.js'
    ])
    .pipe(jasmine());
});

// used for in browser testing - easier for doing step by step debugging
gulp.task('build-test', function() {
  gulp.src([
    'src/Base/*'
  ])
  .pipe(browserify())
  .pipe(gulp.dest('build/production.js'));
});