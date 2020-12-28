const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const sass        = require('gulp-sass');
const webp        = require('gulp-webp');
const resizer     = require('gulp-image-resize');
const fileinclude = require('gulp-file-include');
const i18n        = require('gulp-html-i18n');
const filter      = require('gulp-filter');
const rename      = require('gulp-rename');

const buildFolder = './dist'
const otherFilesPattern = ['src/*.png', 'src/*.ico', 'src/images/*', 'src/js/*', 'src/CNAME', 'src/fonts/**/*']
const scssPattern = "src/scss/**/*.scss"
const htmlPattern = "src/*.html"
const translationPattern = "src/lang/**/*.yaml"

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(scssPattern)
        .pipe(sass())
        .pipe(gulp.dest(buildFolder + "/css"))
        .pipe(browserSync.stream());
});

gulp.task('html', function() {
  const fileFilter = filter(['**', '!**/_*.html']);

  return gulp
      .src(htmlPattern)
      .pipe(fileFilter)
      .pipe(fileinclude())
      .pipe(i18n({
        langDir: './src/lang',
        trace: true,
        createLangDirs: true,
        defaultLang: 'de'
      }))
      .pipe(gulp.dest(buildFolder));
});

gulp.task('hero_images', function() {
  return gulp
      .src("src/images/hero/*")
      .pipe(gulp.dest(buildFolder + "/images/hero"))
      .pipe(webp())
      .pipe(gulp.dest(buildFolder + "/images/hero"))
});

gulp.task('small_hero_images', function() {
  return gulp
      .src("src/images/hero/*")
      // .pipe(resizer({width: 1000}))
      .pipe(rename({suffix: '_small'}))
      .pipe(webp())
      .pipe(gulp.dest(buildFolder + "/images/hero"))
});

gulp.task('copy', function() {
  return gulp
      .src(otherFilesPattern, { "base" : "src" })
      .pipe(gulp.dest(buildFolder));
})

gulp.task('build', gulp.parallel(['sass', 'html', 'copy', 'hero_images', 'small_hero_images']));

// Static Server + watching scss/html files
gulp.task('default', gulp.parallel(['sass', 'html', 'copy', 'hero_images', 'small_hero_images'], function() {
    browserSync.init({
        server: "dist"
    });

    gulp.watch(scssPattern, gulp.series('sass'));
    gulp.watch(htmlPattern, gulp.series('html'));
    gulp.watch(translationPattern, gulp.series('html'));
    gulp.watch(otherFilesPattern, gulp.series('copy'));
    gulp.watch("src/images/hero/*", gulp.parallel('hero_images', 'small_hero_images'));
    gulp.watch("dist/**").on('change', browserSync.reload);
}));
