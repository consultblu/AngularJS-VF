var gulp = require('gulp');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate')
var bytediff = require('gulp-bytediff');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var csslint = require('gulp-csslint');
var cleanCSS = require('gulp-clean-css');

// File Paths
var DIST_PATH = 'dist';
var DIST_CSS = DIST_PATH + '/css';
var DIST_SCRIPTS = DIST_PATH + '/scripts';
var DIST_IMAGES = DIST_PATH + '/assets/images';
var DIST_DOCS = DIST_PATH + '/assets/docs';
var SCRIPTS_PATH = 'src/scripts/';
var APP_SCRIPTS_PATH = SCRIPTS_PATH + 'app/';
var VENDOR_NG_SCRIPTS_PATH = SCRIPTS_PATH + 'vendor/ng/*.js';
var VENDOR_NNG_SCRIPTS_PATH = SCRIPTS_PATH + 'vendor/non-ng/*.js';
var CSS_PATH = 'src/css/**/*.css';
var CSS_APP_PATH = 'src/css/app/*.css';
var CSS_VENDOR_NG_PATH = 'src/css/ng/*.css';
var CSS_VENDOR_NNG_PATH = 'src/css/non-ng/*.css';
var IMAGE_PATH = "src/images/**/*";
var DOCS_PATH = "src/docs/**/*.md";

// Styles
gulp.task('styles', function () {
  console.log('Starting styles task');
  gulp.start('appStyles');
  gulp.start('vendorStyles');
});

// Styles - Custom css
gulp.task('appStyles', function () {
  console.log('Starting custom styles task');
  return gulp.src(['src/css/reset.css', CSS_APP_PATH])
    .pipe(concat('styles.css'))
    .pipe(csslint())
    .pipe(csslint.formatter())
    .pipe(cleanCSS())
    .pipe(gulp.dest(DIST_CSS))
    .pipe(livereload());
});

// Styles - Vendor css
gulp.task('vendorStyles', function () {
  console.log('Starting vendor styles task');
  return gulp.src([CSS_VENDOR_NG_PATH, CSS_VENDOR_NNG_PATH])
    .pipe(concat('vendor.css'))
    .pipe(csslint())
    .pipe(csslint.formatter())
    .pipe(cleanCSS())
    .pipe(gulp.dest(DIST_CSS))
    .pipe(livereload());
});

// Scripts
gulp.task('scripts', function () {
  console.log('Starting script task');
  gulp.start('appScripts');
  gulp.start('vendorScripts');
  gulp.start('vendorNGScripts');
});

// Scripts - Custom
gulp.task('appScripts', function () {
  console.log('Starting App script task');
  return gulp.src([
      APP_SCRIPTS_PATH + 'app-ng.js'
    , APP_SCRIPTS_PATH + 'config/*.js'
    , APP_SCRIPTS_PATH + 'factory/*.js'
    , APP_SCRIPTS_PATH + 'service/*.js'
    , APP_SCRIPTS_PATH + 'filter/*.js'
    , APP_SCRIPTS_PATH + 'controller/*.js'
    , APP_SCRIPTS_PATH + 'directive/*.js'
    , APP_SCRIPTS_PATH + 'cache/*.js'
    ])
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    //.pipe(uglify())
    .pipe(gulp.dest(DIST_SCRIPTS))
    .pipe(livereload());
});
// Scripts - Vendor Scripts
gulp.task('vendorScripts', function () {
  console.log('Starting App script task');
  return gulp.src([ SCRIPTS_PATH + 'vendor/non-ng/jquery*.js', VENDOR_NNG_SCRIPTS_PATH ])
    .pipe(concat('vendor.js'))
    .pipe(ngAnnotate())
    //.pipe(uglify())
    .pipe(gulp.dest(DIST_SCRIPTS))
    .pipe(livereload());
});
// Scripts - Vendor Scripts
gulp.task('vendorNGScripts', function () {
  console.log('Starting App script task');
  return gulp.src([ SCRIPTS_PATH + 'vendor/ng/angular.js', VENDOR_NG_SCRIPTS_PATH ])
    .pipe(concat('vendor-ng.js'))
    .pipe(ngAnnotate())
    //.pipe(uglify())
    .pipe(gulp.dest(DIST_SCRIPTS))
    .pipe(livereload());
});

// Images
gulp.task('images', function () {
  console.log('Starting image task');
  return gulp.src(IMAGE_PATH)
    .pipe(gulp.dest(DIST_IMAGES))
    .pipe(livereload());
});

// Documents
gulp.task('documents', function () {
  console.log('Starting documents task');
  return gulp.src(DOCS_PATH)
    .pipe(gulp.dest(DIST_DOCS))
    .pipe(livereload());
});

//Default
gulp.task('default', function () {
  console.log('Starting default task');
  gulp.start('scripts');
  gulp.start('images');
  gulp.start('documents');
  gulp.start('styles');
});



//Production
gulp.task('prod', function () {
  console.log('Starting production tasks');
  gulp.start('prod-scripts');
  gulp.start('prod-styles');	
});

//Production
gulp.task('prod-scripts', function () {
  console.log('Starting production scripts task');
	gulp.src([
		DIST_SCRIPTS + "/vendor.js",
		DIST_SCRIPTS + "/vendor-ng.js",
		DIST_SCRIPTS + "/app.js"
					 ])
	.pipe(concat('scripts.min.js'), {newLine: ';'})
	.pipe(ngAnnotate({add: true}))
	.pipe(bytediff.start())
	.pipe(uglify({mangle: true}))
	.pipe(bytediff.stop())
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(DIST_SCRIPTS));
});

//Production
gulp.task('prod-styles', function () {
  console.log('Starting production styles task');
	gulp.src([
		DIST_CSS + "/styles.css",
		DIST_CSS + "/vendor.css"
	])
	.pipe(concat('styles.min.css'))
	.pipe(uglify())
	.pipe(gulp.dest(DIST_CSS));
});

// Watch
gulp.task('watch', function () {
  console.log('Starting watch task');
  //require('./server.js');
  livereload.listen();
  gulp.watch([SCRIPTS_PATH, CSS_PATH, IMAGE_PATH, DOCS_PATH], ['scripts', 'styles', 'images', 'documents']);
});