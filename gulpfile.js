const { watch, src, dest, series, parallel } = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const image = require("gulp-image");
const browserSync = require("browser-sync").create();

const files = {
  htmlPath: "./src/*.html",
  scssPath: "./src/scss/**/*.scss",
  imgsPath: "./src/images/**/*.*",
  distPath: "./dist",
  distCssPath: "./dist/css",
  distImgsPath: "./dist/images",
};

function htmlTask(done) {
  src(files.htmlPath).pipe(dest(files.distPath));
  done();
}

function scssTask(done) {
  return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest(files.distCssPath));
  done();
}

function imagesTask(done) {
  src(files.imgsPath).pipe(image()).pipe(dest(files.distImgsPath));
  done();
}

function watchTask() {
  watch(files.htmlPath, series(htmlTask, reload));
  watch(files.scssPath, series(scssTask, reload));
  watch(files.imgsPath, series(imagesTask, reload));
}

function liveReload(done) {
  browserSync.init({
    server: {
      baseDir: files.distPath,
    },
  });
  done();
}

function reload(done) {
  browserSync.reload();
  done();
}

exports.default = series(
  parallel(htmlTask, scssTask, imagesTask, watchTask, liveReload)
);
