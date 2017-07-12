var gulp = require('gulp'),
    gutil = require('gulp-util'),
    argv = require('yargs').argv,
    buffer = require('vinyl-buffer'),
    gulpif = require('gulp-if'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify');
    babelify = require('babelify');

// Paths
var sassSources = ['sites/all/themes/custom/rarefew/sass/*.scss',
      'sites/all/themes/custom/rarefew/sass/**/*.scss',
    ],
    scripts_dest = 'sites/all/themes/custom/rarefew/js/min/',
    sass_dest = 'sites/all/themes/custom/rarefew/css/',
    srcApp = './sites/all/themes/custom/rarefew/js/react_src/app.js',
    srcReact = './sites/all/themes/custom/rarefew/js/react_src/**/*.js',
    app = './sites/all/themes/custom/rarefew/js/react_builds/';

gulp.task('sass', function() {
  gulp.src(sassSources)
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest(sass_dest));
});

gulp.task('watch', function() {
  gulp.watch( srcReact , ['jsreact']);
  gulp.watch(sassSources, ['sass']);
});

// Build an output file. Babelify is used to transform 'jsx' code to JavaScript code. 
gulp.task('jsreact', function() {
  // use production build
  if (argv.production){
    process.env.NODE_ENV = 'production';
  }
  gulp.src(srcApp)
    .pipe(browserify({
      transform: [babelify.configure({
        presets: ['es2015', 'react']
      })],
      debug: argv.production ? false : true,
    }))
    .pipe(gulpif(argv.production, buffer()))    // Stream files
    .pipe(gulpif(argv.production, uglify().on('error', gutil.log))) // minifiy files
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(app))
    .on('error', function (err) {
      console.error('Error!', err.message);
    }); 
});

gulp.task('default', ['watch', 'jsreact', 'sass']);
