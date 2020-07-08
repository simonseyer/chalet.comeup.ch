const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const sass        = require('gulp-sass');
const fileinclude = require('gulp-file-include');
const i18n        = require('gulp-html-i18n');
const filter      = require('gulp-filter');

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("src/scss/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("css"))
        .pipe(browserSync.stream());
});

gulp.task('html', function() {
  const fileFilter = filter(['**', '!**/_*.html']);

    gulp.src(['src/*.html'])
      .pipe(fileFilter)
      .pipe(fileinclude())
      .pipe(i18n({
        langDir: './src/lang',
        trace: true,
        createLangDirs: true,
        defaultLang: 'de'
      }))
      .pipe(gulp.dest('./'));
  });

// Static Server + watching scss/html files
gulp.task('default', gulp.parallel(['sass', 'html'], function() {

    browserSync.init({
        server: "."
    });

    gulp.watch("src/scss/**/*.scss", gulp.series('sass'));
    gulp.watch("src/*.html").on('change', gulp.series('html'));
    gulp.watch("src/lang/**/*.yaml").on('change', gulp.series('html'));
    gulp.watch("*.html").on('change', browserSync.reload);
}));
