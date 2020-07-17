const { src, dest, task, series, watch } = require("gulp");
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

sass.compiler = require('node-sass');

task("clean", () => {
  // удалять все из папки
  // false - не читаем содержимое файла
  return src("dist/**/*", { read: false }).pipe(rm());
});

task("copy:html", () => {
  // pipe - передает результат одной функции в другую - поток
  // return src("src/styles/main.scss").pipe(dest('dist'));

  // С помощью Gulp можно обрабатывать не только отдельные файлы, 
  // как это было в предыдущем примере, но и целую группу файлов
  // ** - в любой папке
  // return src("src/**/*.scss").pipe(dest('dist')); // будет скопирована папка целиком

  // а можно и так:
  return src("src/*html")
    .pipe(dest('dist'))
    .pipe(reload({ stream: true }));
});

const images = [
  "src/images/**/*.png",
  "src/images/**/*.jpg"
];

task("copy:images", () => {
  return src(images)
    .pipe(dest('dist/images'))
    .pipe(reload({ stream: true }));
});

task("copy:svg", () => {
  return src("src/images/*.svg")
    .pipe(dest('dist/images'))
    .pipe(reload({ stream: true }));
});

task("copy:video", () => {
  return src("src/video/*")
    .pipe(dest('dist/video'))
    .pipe(reload({ stream: true }));
});

const styles = [
  "node_modules/normalize.css/normalize.css",
  "src/styles/main.scss"
];

task("styles", () => {
  return src(styles)
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
    .pipe(dest('dist'))
    .pipe(reload({ stream: true }));
});

const libs = [
  "node_modules/jquery/dist/jquery.js",

  "src/scripts/*.js"
];

task("scripts", () => {
  return src(libs)
    .pipe(sourcemaps.init())
    .pipe(concat("main.min.js", { newLine: ";" })) // склеили
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest('dist'))
    .pipe(reload({ stream: true }));
});

task("icons", () => {
  return src("src/images/icons/*.svg")
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
    .pipe(dest("dist/images/"));
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

watch("./src/styles/**/*.scss", series("styles"));
watch("./src/*.html", series("copy:html"));
watch(images, series("copy:images"));
watch("./src/images/*.svg", series("copy:svg"));
watch("./src/video/*", series("copy:video"));
watch("./src/scripts/*.js", series("scripts"));
watch("./src/images/icons/*.svg", series("icons"));


task("default", series("clean", "copy:html", "copy:images", "copy:svg", "copy:video", "icons", "styles", "scripts", "server"));