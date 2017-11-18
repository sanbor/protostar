var gulp = require('gulp');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var less = require('gulp-less');
var path = require('path');
var nunjucksRender = require('gulp-nunjucks-render');

/**
 * Wrap a stream in an error-handler (until Gulp 4, needed to prevent "watch"
 * task from dying on error).
 */
function wrap(stream) {
  stream.on('error', function(error) {
    gutil.log(gutil.colors.red(error.message));
    gutil.log(error.stack);
      gutil.log(gutil.colors.yellow('[aborting]'));
      stream.end();
  });

  return stream;
}
gulp.task('nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('app/pages/**/*.+(html|nunjucks|njk)')
  // Renders template with nunjucks
  .pipe(wrap(nunjucksRender({
      path: ['app/templates']
    })))
  // output files in app folder
  .pipe(gulp.dest('dist'))
});

gulp.task('less', function () {
  return gulp.src('app/styles/less/**/*.less')
    .pipe(wrap(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    })))
    .pipe(gulp.dest('dist/css'))
});

// process JS files and return the stream.
gulp.task('js', function () {
    return gulp.src('app/scripts/*js')
        // .pipe(browserify())
        // .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// watch files for changes and reload
gulp.task('serve', ['js'], function() {
  // Serve files from the root of this project
  browserSync.init({
      server: {
          baseDir: "./dist"
      }
  });

  gulp.watch('app/**/*.less', ['less']);
  gulp.watch(['app/**/*.nunjucks','app/**/*.njk', 'app/**/*.html'], ['nunjucks']);
  gulp.watch(['app/scripts/**/*.js'], ['js']);
  gulp.watch(['**/*.html', 'css/**/*.css', 'js/**/*.js'], {cwd: 'dist'}, browserSync.reload);
});
gulp.task('default', ['less', 'nunjucks', 'serve']);
