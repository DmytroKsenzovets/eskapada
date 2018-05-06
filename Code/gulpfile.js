var gulp = require("gulp");
var sass= require("gulp-sass");
var watch = require("gulp-watch");

var browserSync = require("browser-sync");
var imgmin = require('gulp-imagemin');
var imgpng = require('imagemin-pngquant');
var pref = require("gulp-autoprefixer");
var del = require('del');
var cache = require('gulp-cache');
var uglify = require('gulp-uglifyjs');

gulp.task('sass', function () {
	return gulp.src('app/css/**/*.css')
	.pipe(pref(['last 15 versions'], {cascade : true}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task("watch", ['browsersync', 'sass', 'scripts'],function () {
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
	
});

gulp.task("browsersync", function () {
	browserSync.init({
		server: {
			baseDir: 'app'
		}
	});
});


gulp.task('img', function () {
	return gulp.src('app/img/**/*')
	.pipe(cache(
		imgmin({ 
		interlaced: true,
    	progressive: true,
   		optimizationLevel: 5,
   		svgoPlugins: [{removeViewBox: false}],
   		une: [imgpng()]
	})))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('compress', function () {
   return gulp.src(['app/js/**/*.js'])
	.pipe(uglify(''))
	.pipe(gulp.dest('app/js'))
    
});

gulp.task('clean', function () {
	return  del.sync('dist');
});

gulp.task('cleanCache', function () {
	return  cache.clearAll();
});


gulp.task('build',['clean', 'sass', 'compress', 'img'], function () {
	var buildcss = gulp.src(['app/css/**/*.css'])
	.pipe(gulp.dest('dist/css'));

	var buildfont = gulp.src(['app/fonts/**/*.*'])
	.pipe(gulp.dest('dist/fonts'));

	var buildjs = gulp.src(['app/js/**/*.js'])
	.pipe(gulp.dest('dist/js'));

	var buildhtml = gulp.src('app/**/*.html')
	.pipe(gulp.dest('dist'));



});