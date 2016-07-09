var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    srcs = [];

srcs.push('./scripts/app-base/polyfills.js');
srcs.push('./scripts/vendor/jquery-2.1.4.min.js');
srcs.push('./scripts/vendor/jquery-ui-1.11.4.min.js');
srcs.push('./scripts/vendor/plugins/**/*.js');
srcs.push('./scripts/app-plugins/**/*.js');
srcs.push('./scripts/app-base/const.js');
srcs.push('./scripts/app-base/util.js');
srcs.push('./scripts/app-base/util.ui.js');
srcs.push('./scripts/app/**/*.js');

/** JS Task */
gulp.task('js', function () {
    gulp.src(srcs)
        .pipe(plumber())
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./build'));
});

/** Default */
gulp.task('default', ['js']);
