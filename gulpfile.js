var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var path = require('path');

function pathBack(path) {
  return path.replace(/[^\/]+/g, "..");
}

var tsProject = ts.createProject('./tsconfig.json', { sortOutput: true });

gulp.task('default', ['build']);

gulp.task('build', function() {
  return tsProject.src()
    .pipe(sourcemaps.init())
      .pipe(ts(tsProject)).js
      .pipe(babel())
    .pipe(sourcemaps.write('.', {includeContent: false,
      sourceRoot: function(file) {
        var relMapPath = path.dirname(file.sourceMap.sources[0]);
        var relBackPath = pathBack(relMapPath);
        return path.join("..", relBackPath).replace(/\\/g, "/");
      }
    }))
    .pipe(gulp.dest('out'));
});
