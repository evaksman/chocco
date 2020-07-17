const { src, dest, task, series, watch, parallel } = require("gulp");
const rm = require('gulp-rm');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');

const {DIST_PATH, SRC_PATH, STYLES_LIBS, JS_LIBS} = require('./gulp.config')

sass.compiler = require('node-sass');

task("clean", () => {
  // удалять все из папки
  // false - не читаем содержимое файла
  return src(`${DIST_PATH}/**/*`, { read: false }).pipe(rm());
});

task("copy:html", () => {
  // pipe - передает результат одной функции в другую - поток
  // return src("src/styles/main.scss").pipe(dest('dist'));

  // С помощью Gulp можно обрабатывать не только отдельные файлы, 
  // как это было в предыдущем примере, но и целую группу файлов
  // ** - в любой папке
  // return src("src/**/*.scss").pipe(dest('dist')); // будет скопирована папка целиком

  // а можно и так:
  return src(`${SRC_PATH}/*html`)
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

const images = [
  `${SRC_PATH}/images/**/*.png`,
  `${SRC_PATH}/images/**/*.jpg`
];

task("copy:images", () => {
  return src(images)
    .pipe(dest(`${DIST_PATH}/images`))
    .pipe(reload({ stream: true }));
});

task("copy:svg", () => {
  return src(`${SRC_PATH}/images/*.svg`)
    .pipe(dest(`${DIST_PATH}/images`))
    .pipe(reload({ stream: true }));
});

task("copy:video", () => {
  return src(`${SRC_PATH}/video/*`)
    .pipe(dest(`${DIST_PATH}/video`))
    .pipe(reload({ stream: true }));
});

// const styles = [
//   "node_modules/normalize.css/normalize.css",
//   `${SRC_PATH}/styles/main.scss`
// ];

task("styles", () => {
  return src([
    ...STYLES_LIBS,
    `${SRC_PATH}/styles/main.scss`
  ])
    .pipe(sourcemaps.init())
    .pipe(concat("main.min.scss")) // склеили
    .pipe(sassGlob()) // импорт всех стилей сразу
    .pipe(sass().on('error', sass.logError)) // скомпилировали
    .pipe(autoprefixer({ // автопрефиксер для разных браузеров
      cascade: false
    }))
    // .pipe(gcmq())
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(sourcemaps.write())
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

// const libs = [
//   "node_modules/jquery/dist/jquery.js",

//   `${SRC_PATH}/scripts/*.js`
// ];

task("scripts", () => {
  return src([
    ...JS_LIBS,
    `${SRC_PATH}/scripts/*.js`
  ])
    .pipe(sourcemaps.init())
    .pipe(concat("main.min.js", { newLine: ";" })) // склеили
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

task("icons", () => {
  return src(`${SRC_PATH}/images/icons/*.svg`)
    .pipe(svgo({
      plugins: [
        {
          removeAttrs: {
            attrs: "(fill|stroke|style|width|height|data.*)"
          }
        }
      ]
    }))
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: "../sprite.svg"
        }
      }
    }))
    .pipe(dest(`${DIST_PATH}/images/`));
});

// Static server
task('server', () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
    // online: true,
    // tunnel: true,
    // logLevel: "debug"
  });
});

watch(`${SRC_PATH}/styles/**/*.scss`, series("styles"));
watch(`${SRC_PATH}/*.html`, series("copy:html"));
watch(images, series("copy:images"));
watch(`${SRC_PATH}/images/*.svg`, series("copy:svg"));
watch(`${SRC_PATH}/video/*`, series("copy:video"));
watch(`${SRC_PATH}/scripts/*.js`, series("scripts"));
watch(`${SRC_PATH}/images/icons/*.svg`, series("icons"));


task("default", series("clean", parallel("copy:html", "copy:images", "copy:svg", "copy:video", "icons", "styles", "scripts"), "server"));