var browserify = require('browserify');
var gulp = require('gulp');
var source = require("vinyl-source-stream");
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var buffer = require('vinyl-buffer');
var livereload = require('gulp-livereload');
var lr = require('tiny-lr');  
var server = lr();
var environments = require('gulp-environments');
var preprocess = require('gulp-preprocess');

var development = environments.make('development');
var production = environments.make('production');

console.log(production())


gulp.task('js', function(){
  var b = browserify();
  b.transform(reactify);
  b.add('./src/js/app.js');
  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(preprocess())
    .pipe(production(uglify({
        output: {
            ascii_only: true
        }
    })))
    .pipe(gulp.dest('./web/js'));
});

 
gulp.task('sass', function () {
    gulp.src('./src/scss/app.scss')
        .pipe(preprocess())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('./web/css'))
        .pipe(livereload(server));
});


gulp.task('html', function(){
	gulp.src('./src/index.html')
        .pipe(preprocess())
		.pipe(gulp.dest('./web'))
});


gulp.task('lr-server', function() {  
    server.listen(3000, function(err) {
        if(err) return console.log(err);
    });
});


gulp.task('cordova:prepare', function(){
	gulp.src('./web/css/*.css')
		.pipe(gulp.dest('./cordova/www/css'));

	gulp.src('./web/css/*.js')
		.pipe(gulp.dest('./cordova/www/js'));

	gulp.src('./web/*.html')
		.pipe(gulp.dest('./cordova/www'))
});


gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 4002}));
  app.use(express.static('./web'));
  app.listen(3000);
});


gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(4002);
});


function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}


gulp.task('watch', function() {
  gulp.watch('./src/scss/*.scss', ['sass']);
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./src/*.html', ['html']);


  gulp.watch('./web/css/*.css', notifyLiveReload);
  gulp.watch('./web/js/**/*.js', notifyLiveReload);
  gulp.watch('./web/*.html', notifyLiveReload);
});



gulp.task('default', ['js', 'sass', 'html', 'express', 'livereload', 'watch']);

gulp.task('web', ['js', 'sass', 'html']);