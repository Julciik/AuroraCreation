const { watch, src, dest, series, parallel } = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const image = require("gulp-image");
const browserSync = require("browser-sync").create();

const files = {
  src: {
    html: "./src/*.html",
    scss: "./src/scss/**/*.scss",
    js: "./src/js/**/*.js",
    img: "./src/images/**/*.*",
  },
  dist: {
    base: "./dist",
    css: "./dist/css",
    js: "./dist/js",
    img: "./dist/images",
  },
};

function htmlTask(done) {
  src(files.src.html).pipe(dest(files.dist.base));
  done();
}

function scssTask(done) {
  return src(files.src.scss)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest(files.dist.css));
  done();
}

function jsTask(done) {
  src(files.src.js)
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(concat("index.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest(files.dist.js));
  done();
}

function imagesTask(done) {
  src(files.src.img).pipe(image()).pipe(dest(files.dist.img));
  done();
}

function watchTask() {
  watch(files.src.html, series(htmlTask, reload));
  watch(files.src.scss, series(scssTask, reload));
  watch(files.src.js, series(jsTask, reload));
  watch(files.src.img, series(imagesTask, reload));
}

function liveReload(done) {
  browserSync.init({
    server: {
      baseDir: files.dist.base,
    },
  });
  done();
}

function reload(done) {
  browserSync.reload();
  done();
}

exports.default = series(
  parallel(htmlTask, scssTask, jsTask, imagesTask, watchTask, liveReload)
);
