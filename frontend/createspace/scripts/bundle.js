'use strict';

var $optimize = require('./bundle/optimize');
var $templateCache = require('./bundle/template-cache');

var $fs = require('fs');
var $path = require('path');

var $rimraf = require('rimraf');
var $upTheTree = require('up-the-tree');
var $browserify = require('browserify');
var $q = require('q');
var $globby = require('globby');
var $ngAnnotate = require('ng-annotate');
var $sass = require('node-sass');
var $colors = require('colors');
var $yargs = require('yargs');

var projectRootPath = $upTheTree();

var projectSrcPath = $path.resolve(projectRootPath, 'app');
var projectTargetPath = $path.resolve(projectRootPath, 'target');

module.exports = {
    bundle: bundle,
    cleanTarget: cleanTarget,
    pruneTarget: pruneTarget,
    browserify: browserify,
    sass: sass,
    copy: copy,
    optimize: $optimize,
    templateCache: $templateCache.templateCache,
    annotate: annotate
};

// execute when not imported
if (!module.parent) {

    console.log('Creating bundle..');

    bundle({
        uglify: $yargs.argv.uglify || false,
        prune: $yargs.argv.prune || false
    }).then(function () {
        console.log('Finished creating bundle.');

    }).catch(function (err) {
        setTimeout(function () { throw err; }, 0);
    });
}

function bundle (config) {

    config = config || {
        uglify: true,
        prune: true
    };

    var now = new Date().getTime();

    var qStream = cleanTarget()
        .then(function () {
            return $q.all([
                browserify().then(annotate), // browserify() and annotate() go hand in hand
                copy(),
                sass(),
                $templateCache.templateCache()
            ]);
        });

    if (config.uglify) {
        qStream = qStream.then($optimize.uglify);
    }

    qStream = qStream
        .then($optimize.concatLibraries)
        .then($optimize.concat);

    if (config.prune) {
        qStream = qStream.then(pruneTarget);
    }

    qStream = qStream
        .then(function () {
            console.log($colors.green('Build done, total build time: ' + (new Date().getTime() - now) + 'ms'));
        });

    return qStream;
}

function pruneTarget () {

    var now = new Date().getTime();

    return $globby([
        './' + $path.relative('.', projectTargetPath) + '/csApp.js',
        './' + $path.relative('.', projectTargetPath) + '/templatecache.js'
    ]).then(function (files) {

        var deferreds = [];
        files.forEach(function (file) {
            deferreds.push($q.nfcall($fs.unlink, file));
        });

        return $q.all(deferreds)
            .then(function () {
                console.log('Prune done, build time: ' + (new Date().getTime() - now) + 'ms');
            });

    });

}

function cleanTarget () {

    var now = new Date().getTime();

    // wrap in an allSettled to eat 'dir exists' errors of mkdir
    return $q.allSettled([$q.nfcall($fs.mkdir, projectTargetPath)])
        .then(function () {

            return $q.nfcall($rimraf, projectTargetPath + '/*')
                .then(function () {
                    console.log('Clean done, build time: ' + (new Date().getTime() - now) + 'ms');
                });

        });

}

function browserify () {

    var now = new Date().getTime();

    return $globby([
        './' + $path.relative('.', projectSrcPath) + '/**/*.js'
    ]).then(function (files) {

        var b = $browserify({
            standalone: 'yes'
        });

        files.forEach(function (file) {
            // make sure file is not empty
            if ($fs.readFileSync(file).toString() !== '') {
                b.add(file);
            }
        });

        return $q.ninvoke(b, 'bundle')
            .then(function (buffer) {

                // add comments for coverage report
                var contents = buffer.toString();
                contents = '/* istanbul ignore next */' + contents;
                contents = contents.replace('(function(){var define,module,exports;return ',
                    '(function(){var define,module,exports;return /* istanbul ignore next */');

                return $q.nfcall($fs.writeFile, $path.resolve(projectTargetPath, 'csApp.js'), contents)
                    .then(function () {
                        console.log('Browserify done, build time: ' + (new Date().getTime() - now) + 'ms');
                    });

            }, function (err) {
                console.log('browserify failed');
                console.log(err);
            });

    });

}

function sass () {

    var now = new Date().getTime();

    var relativeSrcPath = './' + $path.relative('.', projectSrcPath);
    var glob = [
        relativeSrcPath + '/css/!(_)*.scss'
    ];

    return $globby(glob)
        .then(function (files) {

            var cssChunks = [];

            var deferreds = [];
            files.forEach(function (file) {
                console.log(file);
                var deferred = $q.defer();
                deferreds.push(deferred.promise);

                $sass.render({
                    file: file,
                    indentWidth: 4,
                    outputStyle: 'expanded',
                    indentedSyntax: true
                }, function (err, result) {

                    if (err) {
                        throw err;
                    }

                    cssChunks.push(result.css.toString());
                    deferred.resolve();

                });

            });

            return $q.allSettled(deferreds)
                .then(function () {

                    return $q.nfcall($fs.writeFile, $path.resolve(projectTargetPath, 'createspace.css'), cssChunks.join('\n'))
                        .then(function () {
                            console.log('Sass done for my web, build time: ' + (new Date().getTime() - now) + 'ms');
                        });

                });

        });

}

function copy () {

    var now = new Date().getTime();

    var relativeSrcPath = './' + $path.relative('.', projectSrcPath);

    return $globby([
        relativeSrcPath + '/**/*.css',
        relativeSrcPath + '/**/*.eot',
        relativeSrcPath + '/**/*.svg',
        relativeSrcPath + '/**/*.ttf',
        relativeSrcPath + '/**/*.woff'
    ]).then(function (files) {

        var deferreds = [];

        files.forEach(function (file) {

            var promise = $q.nfcall($fs.readFile, file)
                .then(function (buffer) {

                    var target = $path.resolve(projectTargetPath, $path.basename(file));
                    return $q.nfcall($fs.writeFile, target, buffer);

                });

            deferreds.push(promise);

        });

        return $q.allSettled(deferreds)
            .then(function () {
                console.log('Copy done, build time: ' + (new Date().getTime() - now) + 'ms');
            });

    });

}

function annotate () {

    var now = new Date().getTime();

    return $q.nfcall($fs.readFile, './target/csApp.js')
        .then(function (result) {
           
            var annotationResult = $ngAnnotate(result.toString(), {
                add: true
            });
            return $q.nfcall($fs.writeFile, './target/csApp.js', annotationResult.src)
                .then(function () {
                    console.log('Annotate done, build time: ' + (new Date().getTime() - now) + 'ms');
                });

        });

}