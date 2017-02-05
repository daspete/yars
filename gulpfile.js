var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer');

gulp.task('assets', function () {
    return gulp
        .src('src/assets/images/**/*.{jpg,png,gif}')
        .pipe(imagemin())
        .pipe(gulp.dest('assets/images'));
});

gulp.task('sass', function(){
    return gulp.src('src/sass/styles.scss')
        .pipe(sass.sync({ outputStyle: 'compressed' }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('css/'));
});

gulp.task('js', function(){
    var _browserify = browserify({
        entries: 'src/js/slider.js',
        transform: [
            babelify.configure({
                presets: ['es2015']
            })
        ]
    });

    return _browserify.bundle()
        .pipe(source('slider.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('js'));
});

gulp.task('watch', function (){
    gulp.watch('src/assets/images/**/*.{jpg,png,gif}', ['assets']);
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('src/js/**/*.js', ['js']);
});

gulp.task('default', [
    'assets',
    'sass',
    'js',
    'watch'
]);