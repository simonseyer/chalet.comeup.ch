var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
const fileinclude = require('gulp-file-include');

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("src/scss/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

gulp.task('fileinclude', function() {
    gulp.src(['src/*.html'])
      .pipe(fileinclude())
      .pipe(gulp.dest('./dist/'));
  });

// Static Server + watching scss/html files
gulp.task('default', gulp.parallel(['sass', 'fileinclude'], function() {

    browserSync.init({
        server: "./dist/"
    });

    gulp.watch("src/scss/**/*.scss", gulp.series('sass'));
    gulp.watch("src/*.html").on('change', gulp.series('fileinclude'));
    gulp.watch("dist/*.html").on('change', browserSync.reload);
}));
