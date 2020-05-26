const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();

gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });

    gulp.watch('src/css/**/*', ['css']);
    gulp.watch('src/ts/**/*.ts', ['ts']);
    gulp.watch("./src/*.html", ['html']);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

gulp.task('html', () => {
    return gulp
        .src(['src/index.html'])

        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('ts', function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/ts/main.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.ts']
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('clean', function () {
    return del(['dist/*']);
});

gulp.task('css', function () {
    return gulp
        .src(['src/css/*'])
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('build', [
        'clean',
        'html',
        'ts',
        'css'
    ]
);

gulp.task('dev', ['build', 'watch']);