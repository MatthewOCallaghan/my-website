const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref'); // Concatenates js and css files
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const postcss = require('gulp-postcss');
const purgecss = require('gulp-purgecss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const revAll = require('gulp-rev-all'); // Puts hashes in filenames so browser's cache can hold assets for a long time but will fetch new assets if they have been updated (because file names will be different)
const imagemin= require('gulp-imagemin');
const cache = require('gulp-cache');
const del = require('del');

function setupBrowserSync(cb) {
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    });
    cb();
}

function processSass() {
    return src('src/scss/**/*.scss')
            .pipe(sass({ includePaths: ['node_modules'] }))
            .pipe(dest('src/css'))
            .pipe(browserSync.reload({
                stream: true
            }));
}

function reload(cb) {
    browserSync.reload();
    cb();
}

function watchFiles() {
    watch('src/scss/**/*.scss', processSass);
    watch('src/**/*.html', reload);
    watch('src/js/**/*.js', reload);
}

function buildFiles() {
    const postcssPlugins = [autoprefixer(), cssnano()];
    return src(['src/**/*.html', 'src/images/**/*.+(png|jpg|gif|svg)', 'src/videos/*'])
            .pipe(gulpIf('*.html', useref()))
            .pipe(gulpIf('*.html', htmlmin({ minifyJS: true, minifyCSS: true, removeComments: true })))
            .pipe(gulpIf('*.js', babel({ presets: ['@babel/env']})))
            .pipe(gulpIf('*.js', uglify()))
            .pipe(gulpIf('*.css', purgecss({ content: ['src/**/*.html', 'src/**/*.js'] }))) // This should go in postcssPlugins but having tried briefly I couldn't get it to work
            .pipe(gulpIf('*.css', postcss(postcssPlugins)))
            .pipe(gulpIf('*.+(png|jpg|gif|svg)', cache(imagemin({ interlaced: true }))))
            .pipe(revAll.revision({ dontRenameFile: [".html"], dontUpdateReference: [".html"]}))
            .pipe(dest('dist'));
}

// Minfiy images now included in build files
// This is because images are needed in that pipe for revAll
// function minifyImages() {
//     return src('src/images/**/*.+(png|jpg|gif|svg)')
//             .pipe(cache(imagemin({ interlaced: true })))
//             .pipe(dest('dist/images'));
// }

function cleanDist() {
    return del('dist');
}

function clearCache(cb) {
    return cache.clearAll(cb);
}

exports.watch = watchFiles;

exports.buildFiles = buildFiles;

// exports.minifyImages = minifyImages;

exports.cleanDist = cleanDist;

exports.clearCache = clearCache;

exports.default = series(setupBrowserSync, processSass, watchFiles);

exports.build = series(cleanDist, processSass, buildFiles);