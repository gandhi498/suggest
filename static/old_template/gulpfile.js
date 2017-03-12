var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-clean-css');

//sass to css
gulp.task('sass', function () {

	gulp.src('sass/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('css/'))

});

//Wiredep - Task to inject bower js files to main html file
gulp.task('bower-inject', function() {

	var target = gulp.src('index.html');	
	target.pipe(wiredep())
		.pipe(gulp.dest('./'))

});

//Gulp Inject - Task to inject js files into main html file
gulp.task('inject-js', function() {

	var target = gulp.src('index.html');
	var sources = gulp.src('js/**/*.js');
	target.pipe(inject(sources, {relative: true, addRootSlash: false}))
	.pipe(gulp.dest('./'))

});

//Gulp Inject - Task to inject css files into main html file
gulp.task('inject-css', function() {

	var target = gulp.src('index.html');
	var sources = gulp.src(['css/**/*.css'], {read: true});
	target.pipe(inject(sources, {relative: true, addRootSlash: false}))
	.pipe(gulp.dest('./'))

});

//Gulp Useref - To concat all files to single file in main html
gulp.task('minify', function() {
	gulp.src('index.html')
		.pipe(useref())
		.pipe(gulp.dest('../build'))
});

//copy templates, image, icons to build
gulp.task('copy', function() {
	gulp.src(['fonts/*','icons/*','templates/*','images/*'], {base: "."})
	.pipe(gulp.dest('../build'))
})





