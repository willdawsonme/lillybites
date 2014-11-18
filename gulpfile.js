/**
 * Definitions
 */
 var gulp         = require('gulp'),
     notify       = require('gulp-notify'),
     filter       = require('gulp-filter'),
     browsersync  = require('browser-sync'),
     bsreload     = browsersync.reload,
     sass         = require('gulp-ruby-sass'),
     changed      = require('gulp-changed'),
     autoprefixer = require('gulp-autoprefixer'),
     svgstore     = require('gulp-svgstore'),
     svgmin       = require('gulp-svgmin'),
     fileinclude  = require('gulp-file-include'),
     imagemin     = require('gulp-imagemin');

/**
 * Gulp.js Default
 */
gulp.task('default', ['fileinclude', 'sass', 'svgstore', 'imagemin', 'browser-sync'], function() {
    gulp.watch('_sass/**/*.scss', ['sass']);
    gulp.watch('_svg/**/*.svg', ['svgstore']);
    gulp.watch('_pages/**/*.html', ['fileinclude']);
    gulp.watch('_includes/**', ['fileinclude']);
    gulp.watch('_images/**', ['imagemin']);
    gulp.watch('_site/*.html', ['bs-reload']);
});

/**
 * SASS Processing
 */
gulp.task('sass', function() {
    return gulp.src('_sass/global.scss')
        .pipe(changed('_site/css'))
        .pipe(sass({
            style: 'compressed'
        }))
        .on('error', function() {
            notify.onError().apply(this, arguments);
            this.emit('end');
        })
        .pipe(autoprefixer())
        .pipe(gulp.dest('_site/css'))
        .pipe(filter('**/*.css'))
        .pipe(bsreload({stream: true}))
});

/**
 * SVG Processing
 */
gulp.task('svgstore', function() {
    return gulp.src('_svg/*.svg')
        .pipe(svgmin())
        .pipe(svgstore({
            fileName: 'svg-defs.svg',
            prefix: 'shape-',
            inlineSvg: true,
            transformSvg: function (svg, cb) {
                svg.attr({ style: 'display:none' });
                cb(null);
            }
        }))
        .pipe(gulp.dest('_includes'))
        .pipe(bsreload({stream: true}))
});

/**
 * File Inclusions
 */
gulp.task('fileinclude', function() {
    return gulp.src('_pages/*.html')
        .pipe(fileinclude())
        .pipe(gulp.dest('_site'))
        .pipe(bsreload({stream: true}))
});

/**
 * Image Optimisations
 */
gulp.task('imagemin', function() {
    return gulp.src('_images/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('_site/images'));
})

/**
 * BrowserSync
 */
gulp.task('browser-sync', function() {
    browsersync({
        server: {
            baseDir: "_site"
        }
    });
});

gulp.task('bs-reload', function() {
    browsersync.reload();
});
