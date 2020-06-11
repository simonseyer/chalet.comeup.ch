var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
const fileinclude = require('gulp-file-include');

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("src/scss/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("css"))
        .pipe(browserSync.stream());
});

gulp.task('fileinclude', function() {
    gulp.src(['src/*.html'])
      .pipe(fileinclude())
      .pipe(gulp.dest('./'));
  });

// Static Server + watching scss/html files
gulp.task('default', gulp.parallel(['sass', 'fileinclude'], function() {

    browserSync.init({
        server: "."
    });

    gulp.watch("src/scss/**/*.scss", gulp.series('sass'));
    gulp.watch("src/*.html").on('change', gulp.series('fileinclude'));
    gulp.watch("*.html").on('change', browserSync.reload);
}));
