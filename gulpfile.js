const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
sass.compiler = require('node-sass');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

// SASS Task
gulp.task('sass', function () {
    return gulp
        .src('./src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
});

// BABEL Task
gulp.task('babel', function () {
    return gulp
        .src('./src/scripts/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: [
                ['@babel/preset-env', {modules: false}]
            ]
        }))
        .pipe(concat('pomodoro.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
})

// BROWSER SYNC Task
gulp.task(
    'server',
    gulp.series('sass', 'babel', function () {
        browserSync.init({
            server: "./",
        });

        gulp
            .watch('./src/scss/**/*.scss', gulp.series('sass'))
            .on('change', browserSync.reload);
        gulp
            .watch('./src/scripts/**/*.js', gulp.series('babel'))
            .on('change', browserSync.reload);
        gulp.watch('./*.html').on("change", browserSync.reload);
    })
);

gulp.task("default", gulp.series("server"));