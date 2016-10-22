const gulp = require('gulp');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const del = require('del');

gulp.task('clean', function () {
  return del(['./build/**/*']);
});

// App Vendor JS
gulp.task('vendor-js', function () {
  return gulp.src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/cookiejs/cookie.min.js'
  ])
  .pipe(plumber())
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('./build'));
});

// App JS
gulp.task('scripts', function () {
  return gulp.src([
    './scripts/app-plugins/**/*.js',
    './scripts/app-base/polyfills.js',
    './scripts/app-base/util.js',
    './scripts/app/**/*.js'
  ])
  .pipe(plumber())
  .pipe(concat('util.js'))
  .pipe(babel({ presets: ['es2015'] }))
  .pipe(gulp.dest('./build'))
  .pipe(rename('util.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./build'));
});

// Watch Files For Changes
gulp.task('watch', function () {
  return gulp.watch('./scripts/**/*.js', ['clean', 'vendor-js', 'scripts']);
});

// Default Task
gulp.task('default', ['clean', 'vendor-js', 'scripts', 'watch']);