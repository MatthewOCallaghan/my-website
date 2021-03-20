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
    watch('src/templates/**/*.njk', processNunjucks);
    watch('src/pages/**/*.njk', processNunjucks);
    watch('src/data.json', processNunjucks);
    // watch(['src/pages/**/*.njk', 'src/templates/**/*.njk', 'src/data.json'], processNunjucks);
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

    return src('dist/**/*.*', { base: 'dist', buffer: false }) // dist/**/*.* matches all files but not folders
        .pipe(connection.filter(remoteFolder, function(localFile, remoteFile, callback) {
            // If css or js files have been changed, revAll will have given them a different hash
            // References only get set (by revAll) in build function, so even if a reference to a css or js file has changed, an HTML file's modified date will be the last time I directly edited it
            // Thus cannot use connection.newer() to filter new files as if an HTML file has not been edited but its CSS file has been, the HTML with the updated reference to the CSS file will not get deployed
            // Thus I am using a custom filter function that keeps files that are new (no equivalent remote file), HTML (so all HTML files get pushed - which is only 6 - as trying to work out which files have updated references is complicated), or newer than their remote versions
            callback(null, !remoteFile || localFile.extname === '.html' || localFile.stat.mtime > remoteFile.ftp.date);
        }))
        .pipe(connection.dest(remoteFolder)) // Deploy
        .pipe(connection.clean(['/**/*.js', '/**/*.css', '/images/**/*', '/videos/**/*'].map(p => remoteFolder + p), './dist', { base: remoteFolder })); // Remove remote files with no local version

}

function cleanDist() {
    return del('dist');
}

function clearCache(cb) {
    return cache.clearAll(cb);
}

exports.clearCache = clearCache;

exports.default = series(parallel(processSass, processNunjucks), setupBrowserSync, watchFiles);

exports.build = series(cleanDist, parallel(processSass, processNunjucks), buildFiles);

exports.deploy = deploy;