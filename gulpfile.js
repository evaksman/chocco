const { src, dest, task, series, watch } = require("gulp");
const rm = require('gulp-rm');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');

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

const styles = [
  "node_modules/normalize.css/normalize.css",
  "src/styles/main.scss"
];

task("styles", () => {
  return src(styles)
    .pipe(concat("main.scss")) // склеили
    .pipe(sassGlob()) // импорт всех стилей сразу
    .pipe(sass().on('error', sass.logError)) // скомпилировали
    .pipe(autoprefixer({ // автопрефиксер для разных браузеров
      cascade: false
    }))
    .pipe(dest('dist'));
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
task("default", series("clean", "copy:html", "styles", "server"));