var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');


var tsProject = ts.createProject('./tsconfig.json', { sortOutput: true });

gulp.task('default', ['build']);

gulp.task('build', function() {
  return tsProject.src()
    .pipe(sourcemaps.init())
      .pipe(ts(tsProject)).js
      .pipe(babel())
    .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../../src'}))
    .pipe(gulp.dest('out'));
});
