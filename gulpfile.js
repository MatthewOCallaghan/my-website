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
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const del = require('del');
const nunjucksRender = require('gulp-nunjucks-render');
const htmlPrettify = require('gulp-html-prettify');
const data = require('gulp-data');
const ftp = require('vinyl-ftp');
const logger = require('fancy-log');

function setupBrowserSync(cb) {
    browserSync.init({
        server: {
            baseDir: 'src',
            serveStaticOptions: {
                extensions: ['html']
            }
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


function processNunjucks() {

    const manageEnvironment = function(environment) {

        // Get object with details of specific project from work array
        environment.addFilter('getWorkInfo', function(work, page) {
            return work.filter(workItem => workItem.page === page)[0];
        });

        // Count properties in an object
        // Used in work-template.njk
        environment.addFilter('countProperties', function(obj) {
            return Object.keys(obj).length;
        })

    }

    return src('src/pages/**/*.njk')
        .pipe(data(() => require('./src/data.json')))
        .pipe(nunjucksRender({
            path: ['src/templates/'],
            manageEnv: manageEnvironment
        }))
        .pipe(htmlPrettify()) // Corrects indentation to make HTML more readable
        .pipe(dest('src'))
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
    watch(['src/pages/**/*.njk', 'src/templates/**/*.njk', 'src/data.json'], processNunjucks);
    watch('src/js/**/*.js', reload);
}

function buildFiles() {
    const postcssPlugins = [autoprefixer(), cssnano()];
    return src(['src/**/*.html', 'src/images/**/*.+(png|jpg|gif|svg)', 'src/videos/*'])
            .pipe(gulpIf('*.html', useref()))
            .pipe(gulpIf('*.html', htmlmin({ minifyJS: true, minifyCSS: true, removeComments: true, collapseWhitespace: true })))
            .pipe(gulpIf('*.js', babel({ presets: ['@babel/env']})))
            .pipe(gulpIf('*.js', uglify()))
            .pipe(gulpIf('*.css', purgecss({ content: ['src/**/*.html', 'src/**/*.js'] }))) // This should go in postcssPlugins but having tried briefly I couldn't get it to work
            .pipe(gulpIf('*.css', postcss(postcssPlugins)))
            .pipe(gulpIf('*.+(png|jpg|gif|svg)', cache(imagemin({ interlaced: true }))))
            .pipe(revAll.revision({ dontRenameFile: [".html"], dontUpdateReference: [".html"]})) // Cache busting
            .pipe(dest('dist'));
}

// Minfiy images now included in build files
// This is because images are needed in that pipe for revAll
// function minifyImages() {
//     return src('src/images/**/*.+(png|jpg|gif|svg)')
//             .pipe(cache(imagemin({ interlaced: true })))
//             .pipe(dest('dist/images'));
// }

function deploy() {
    const config = require('./src/config');

    const connection = ftp.create( {
        host: config.host,
        user: process.env.FTP_USERNAME,
        password: process.env.FTP_PASSWORD,
        log: logger.log
    });

    const remoteFolder = config.remoteFolder;

    return src('dist/**/*', { base: 'dist', buffer: false })
        .pipe(connection.filter(remoteFolder, function(localFile, remoteFile, callback) {
            // console.log(localFile.stat.mtime);
            // console.log(localFile.extname);
            // console.log(remoteFile ? remoteFile.ftp.date : "No remote file");
            callback(null, !remoteFile || localFile.extname === '.html' || localFile.stat.mtime > remoteFile.ftp.date);
        }))
        .pipe(connection.filter(remoteFolder, function(localFile, remoteFile, callback) {
            console.log(localFile.path);
            callback(null, true);
        }));
        // .pipe(connection.newer(remoteFolder))
        // .pipe(connection.dest(remoteFolder))
        // .pipe(connection.clean(['/**/*.js', '/**/*.css', '/images/**/*', '/videos/**/*'].map(p => remoteFolder + p), './dist', { base: remoteFolder }));

}

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

exports.default = series(parallel(processSass, processNunjucks), setupBrowserSync, watchFiles);

exports.build = series(cleanDist, parallel(processSass, processNunjucks), buildFiles);

exports.deploy = deploy;

exports.nunjucks = processNunjucks;