const { src, dest, watch, series } = require('gulp');
// const sass = require('gulp-sass');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();
const nunjucksRender = require('gulp-nunjucks-render');
var gulp = require('gulp');

// Sass Task
function sassTask(){
  return src('app/sass/style.sass', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest('dist/css', { sourcemaps: '.' }));
}

// Nunjucks
gulp.task('nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('app/pages/*.+(html|nunjucks)')
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['app/partials']
    }))
  // output files in app folder
  .pipe(gulp.dest('dist'))
});

// JavaScript Task
function jsTask(){
  return src('app/js/script.js', { sourcemaps: true })
    .pipe(terser())
    .pipe(dest('dist/js', { sourcemaps: '.' }));
}

// Browsersync Tasks
function browsersyncServe(cb){
  browsersync.init({
    server: {
      baseDir: 'dist'
    }
  });
  cb();
}

function browsersyncReload(cb){
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask(){
  watch('*.html', browsersyncReload);
  watch('app/pages/*.nunjucks', browsersyncReload);
  watch('app/templates/*.nunjucks', browsersyncReload);
  watch(['app/sass/*.sass', 'app/js/**/*.js'], series(sassTask, jsTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(
  sassTask,
  jsTask,
  browsersyncServe,
  watchTask
);