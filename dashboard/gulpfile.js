var gulp = require('gulp');
var gutil = require('gulp-util');
var bump = require('gulp-bump');
var template = require('gulp-template');
var fs = require('fs');
var jshint = require('gulp-jshint');
var bowerFiles = require('main-bower-files');
var rename = require("gulp-rename");
var inject = require('gulp-inject');
var sass = require('gulp-sass');
var stylish = require('jshint-stylish');
var connect = require('gulp-connect');
var open = require("gulp-open");
var del = require('del');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var series = require('stream-series');
var angularFilesort = require('gulp-angular-filesort');
var runSequence = require('run-sequence');
var extend = require('object-assign');
var package = require('./package.json');
var concat = require('gulp-concat');
var argv = require('yargs').argv;
var gfilter = require('gulp-filter');

var root = '.';

var path = {
    root: root,
    templates: root + '/templates',
    config: root + '/js/configuration',
    fonts: root + '/fonts',
    sass: root + '/sass',
    css: root + '/css',
    js: root + '/js',
    html: root + '/views',
    bower: root + '/bower_components'
};

function getPackageJson() {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
}

function environment() {
    var version = getPackageJson().version;
    return {
        dev: {
            apiBaseUrl: 'https://dev.exponea.com/api/1.0/',
            appName: 'Dashboard',
            appVersion: version
        },
        live: {
            apiBaseUrl: 'https://exponea.com/api/1.0/',
            appName: 'Dashboard',
            appVersion: version
        }
    }
}

var credentials = {
    debug: {
        secretApiPublicKey: 'pk_test_123',
        exponeaContactEmail: 'dev.contact@exponea.com'
    },
    release: {
        secretApiPublicKey: 'pk_live_123',
        exponeaContactEmail: 'contact@exponea.com'
    }
}

gulp.task('clean-min-css', function () {
    return del([path.root + '/*.min.css']);
});

gulp.task('clean-min-js', function () {
    return del([path.root + '/*.min.js']);
});

gulp.task('clean-min', ['clean-min-js', 'clean-min-css']);

gulp.task('clean-css', function () {
    return del([path.css + '/**/*.css']);
});

gulp.task('clean-fonts', function () {
    return del([path.fonts + '/**/*']);
});

gulp.task('clean-configuration', function () {
    return del([path.config + '/configuration.js']);
});

gulp.task('clean-html', function () {
    return del([path.root + '/index.html']);
});

gulp.task('clean-vendor', function () {
    return del([path.root + '/vendor.min.*']);
});

gulp.task('clean', ['clean-min', 'clean-css', 'clean-fonts', 'clean-configuration', 'clean-html', 'clean-vendor']);

gulp.task('minify-js', ['clean-min-js', 'build-environment-configuration'], function () {
    return gulp.src(path.js + '/**/*.js')
        .pipe(angularFilesort())
        .pipe(concat('app-' + getPackageJson().version + '.min.js'))
        .pipe(uglify({mangle: argv.mangle && true}))
        .pipe(gulp.dest(path.root));
});

gulp.task('minify-css', ['clean-min-css', 'build-sass'], function () {
    return gulp.src(path.css + '/**/*.css')
        .pipe(concat('app-' + getPackageJson().version + '.min.css'))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(path.root));
});

gulp.task('minify-vendor', ['clean-vendor'], function () {
    var jsFilter = gfilter('**/*.js', {restore: true});
    var cssFilter = gfilter('**/*.css', {restore: true});
    var version = getPackageJson().version;
    return gulp.src(bowerFiles())
        .pipe(jsFilter)
        .pipe(concat('vendor-' + version + '.min.js'))
        .pipe(gulp.dest(path.root))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(concat('vendor-' + version + '.min.css'))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(path.root));
});

gulp.task('bump-version', function () {
// We hardcode the version change type to 'patch' but it may be a good idea to
// use minimist (https://www.npmjs.com/package/minimist) to determine with a
// command argument whether you are doing a 'major', 'minor' or a 'patch' change.
    return gulp.src([path.root + '/bower.json', path.root + '/package.json'])
        .pipe(bump({type: "patch"}).on('error', gutil.log))
        .pipe(gulp.dest(path.root));
});

gulp.task('lint', function () {
    return gulp.src(path.js + '/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('build-environment-configuration', ['clean-configuration'], function () {
    var settings = extend(environment()[argv.target], credentials[argv.mode]);
    return gulp.src(path.templates + '/configuration.tpl.js')
        .pipe(template(extend({tmpl_msg: 'THIS IS AUTO GENERATED TEMPLATE RESULT. DO NOT CHANGE IT!!!'}, settings)))
        .pipe(rename('configuration.js'))
        .pipe(gulp.dest(path.config));
});

gulp.task('build-fonts', ['clean-fonts'], function () {
    return gulp.src([
        path.bower + '/bootstrap-sass/assets/fonts/**/*',
        path.bower + '/elusive-iconfont/fonts/**/*',
        path.bower + '/font-awesome/fonts/**/*'])
        .pipe(gulp.dest(path.fonts));
});

gulp.task('build-sass', ['clean-css'], function () {
    return gulp.src(path.sass + '/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(path.css));
});

gulp.task('build-index', ['clean-html', 'build-environment-configuration', 'build-sass', 'build-fonts'], function () {
    var settings = extend(environment()[argv.target], credentials[argv.mode]);
    return gulp.src(path.templates + '/index.tpl.html')
        .pipe(template(extend({tmpl_msg: 'THIS IS AUTO GENERATED TEMPLATE RESULT. DO NOT CHANGE IT!!!'}, settings)))
        .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower'}))
        .pipe(inject(gulp.src(path.js + '/**/*.js').pipe(angularFilesort()), {name: 'scripts'}))
        .pipe(inject(gulp.src(path.css + '/**/*.css', {read: false}), {name: 'styles'}))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(path.root));
});

gulp.task('build-index-min', ['clean-html', 'build-fonts', 'minify-js', 'minify-css', 'minify-vendor'], function () {
    var version = getPackageJson().version;
    var settings = extend(environment()[argv.target], credentials[argv.mode]);
    return gulp.src(path.templates + '/index.tpl.html')
        .pipe(template(extend({tmpl_msg: 'THIS IS AUTO GENERATED TEMPLATE RESULT. DO NOT CHANGE IT!!!'}, settings)))
        .pipe(inject(gulp.src(path.root + '/vendor-' + version + '.min.*', {read: false}), {name: 'bower'}))
        .pipe(inject(gulp.src(path.root + '/app-' + version + '.min.js', {read: false}), {name: 'scripts'}))
        .pipe(inject(gulp.src(path.root + '/app-' + version + '.min.css', {read: false}), {name: 'styles'}))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(path.root));
});

gulp.task('watch', function () {
    return gulp.watch([
        path.js + '/**/*.js',
        path.sass + '/**/*.scss',
        path.html + '/**/*.html',
        path.templates + '/**/*.tpl.*',
        '!' + path.config + '/configuration.js',
        path.root + '/bower.json'], ['reload']);
});

gulp.task('server-start', function () {
    return connect.server({
        root: path.root,
        host: 'localhost',
        port: 9000,
        livereload: (argv.livereload || true)
    });
});

gulp.task('server', ['server-start'], function () {
    return gulp.src(__filename)
        .pipe(open({uri: "http://localhost:9000"}));
});

gulp.task('reload', ['build-index'], function () {
    return gulp.src(path.root + "/index.html")
        .pipe(connect.reload());
});

function logTargetAndMode() {
    gutil.log(gutil.colors.cyan('Building for target: ') +
        gutil.colors.magenta(argv.target.toUpperCase() + '...') + ' in ' +
        gutil.colors.magenta(argv.mode.toUpperCase()) + ' mode');
}

gulp.task('default', function (callback) {
    if (!argv.target) argv.target = 'dev';
    if (!argv.mode) argv.mode = 'debug';

    logTargetAndMode();

    runSequence('clean', 'build-index', ['server', 'watch'], callback);
});

gulp.task('build', function (callback) {
    if (!argv.target) argv.target = 'dev';
    if (!argv.mode) argv.mode = 'debug';

    logTargetAndMode();

    if (argv.mode.toLowerCase() == 'release')
        runSequence('clean', 'lint', 'bump-version', 'build-index-min', callback);
    else
        runSequence('clean', 'build-index', callback);
});