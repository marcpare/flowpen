'use strict';

var browserify = require('browserify');
var babelify = require('babelify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var jshint = require('gulp-jshint');
var jadeify = require('jadeify');
var notify = require('gulp-notify');
var webserver = require('gulp-webserver');

gulp.task('watch', function() {
  watch(['app/**/*', 'static/**/*', 'gulpfile.js'], function() {
    gulp.start('dist');
  });
});

gulp.task('lint', function () {
  return gulp.src('app/**/*.js')
    .pipe(jshint({
      esnext: true
    }))
    .pipe(notify(function (file) {
      if (file.jshint.success) {
        return false; // Don't show something if success 
      }

      var errors = file.jshint.results.map(function (data) {
        if (data.error) {
          return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
        }
      }).join("\n");
      return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
    }))
    .pipe(jshint.reporter('default'));
});

gulp.task('copy-static', function () {
  return gulp.src('static/**/*', {base:'static/'})
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-build', function () {
  return gulp.src('build/*', {base:'build/'})
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build', function() {
  return browserify({entries: './app/main.js', paths: ['.']})
    .transform(jadeify)
    .transform(babelify)
    .bundle()
    .on('error', notify.onError("Browserify error <%= error.toString() %>"))  
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('dist', ['lint', 'build'], function () {
  gulp.start('copy-static');
  gulp.start('copy-build');
}); 

gulp.task('server', function () {
  gulp
    .src('dist')
    .pipe(webserver({
      livereload: false,
      directoryListing: false,
      open: false
  }));
});

gulp.task('start', ['server', 'dist', 'watch'], function () {
  console.log('Starting development environment...'); 
});




