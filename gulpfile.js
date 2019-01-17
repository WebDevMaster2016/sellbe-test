'use strict';

// define gulp plugins
const gulp         = require('gulp'),
	  plumber      = require('gulp-plumber'),
	  sass         = require('gulp-sass'),
	  sourcemaps   = require('gulp-sourcemaps'),
	  autoprefixer = require('gulp-autoprefixer'),
	  rename       = require('gulp-rename'),
	  csso         = require('gulp-csso'),
	  uglify       = require('gulp-uglify'),
	  browserSync  = require('browser-sync').create();

// define global path for source, destination and watching
const path = {
	dist: {
		css        : 'dist/css/',
		js         : 'dist/js/'
	},
	assets: {
		scss       : 'assets/scss/*.scss',
		js         : 'assets/js/*.js'
	},
	watch: {
		scss       : 'assets/scss/**/*.scss',
		js         : 'assets/js/**/*js'
	}
};

const autoprefixerSettings = {
	browsers: [
		'last 2 versions',
		'iOS 7'
	],
	cascade: false
};

//init local server
gulp.task('browser-sync', () => {
	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	});
	browserSync.watch('dist/**/*.*').on('change', browserSync.reload);
});

// compile scss in to css, minify, autoprefixer, rename
gulp.task('scss', () => {
	return gulp.src(path.assets.scss)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(csso({restructure: false}))
		.pipe(autoprefixer(autoprefixerSettings))
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.dist.css));
});

gulp.task('js', () => {
	return gulp.src(path.assets.js)
		.pipe(plumber())
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(path.dist.js));
});

// watch any changes in scss, javascript files
gulp.task('watch', () => {
	gulp.watch(path.watch.scss, gulp.series('scss'));
	gulp.watch(path.watch.js, gulp.series('js'));
});

// define default task
gulp.task('default', gulp.series(
	gulp.parallel('scss', 'js'),
	gulp.parallel('watch', 'browser-sync')
));