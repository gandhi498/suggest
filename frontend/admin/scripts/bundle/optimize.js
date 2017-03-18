'use strict';

var $fs = require('fs');
var $path = require('path');
var $zlib = require('zlib');

var $globby = require('globby');
var $q = require('q');
var $uglifyJs = require('uglify-js');
var $uglifyCss = require('uglifycss');

module.exports = {
    concatLibraries: concatLibraries,
    concat: concat,
    uglify: uglify
};


if (!module.parent) {
    uglify()
        .then(concatLibraries)
        .then(concat);
}

function concatLibraries () {

    var now = new Date().getTime();

    return $globby([
        './lib/angular.min.js',
        './lib/angular-messages.min.js',
        './lib/angular-ui-router.min.js',
        './lib/klm-aria.min.js',
        './lib/angular-recaptcha.min.js',
        './lib/angular-cookies.min.js'
    ]).then(function (files) {

        var bundle = {};

        var deferreds = [];

        files.forEach(function (file) {

            // lock position in bundle
            bundle[file] = undefined;

            deferreds.push($q.nfcall($fs.readFile, file)
                .then(function (result) {

                    bundle[file] = result.toString();

                    $zlib.gzip(result, function (err, gzipResult) {

                        console.log('File: ' + $path.relative('.', file));
                        console.log('   size: ' + result.length.toLocaleString());
                        console.log('   gzipped: ' + gzipResult.length.toLocaleString());
                        console.log('');

                    });

                }));

        });

        return $q.allSettled(deferreds)
            .then(function () {

                var targetPath = './target/libBundle.js';

                var result = [];
                Object.keys(bundle).forEach(function (file) {
                    result.push(bundle[file]);
                });
                result = result.join('\r\n');

                $zlib.gzip(result, function (err, gzipResult) {
                    console.log('Library bundle size: ' + result.length.toLocaleString());
                    console.log('   gzipped: ' + gzipResult.length.toLocaleString());
                });

                return $q.nfcall($fs.writeFile, targetPath, result)
                    .then(function () {
                        console.log('ConcatLibraries done, build time: ' + (new Date().getTime() - now) + 'ms');
                    });

            });


    });



}

function concat () {

    var now = new Date().getTime();

    return $globby([
        './target/libBundle.js',
        './target/csApp.js',
        './target/templatecache.js'
    ]).then(function (files) {

        var bundle = {};

        var deferreds = [];

        files.forEach(function (file) {

            // lock position in bundle
            bundle[file] = undefined;

            deferreds.push($q.nfcall($fs.readFile, file)
                .then(function (result) {

                    bundle[file] = result.toString();

                    $zlib.gzip(result, function (err, gzipResult) {

                        console.log('File: ' + $path.relative('.', file));
                        console.log('   size: ' + result.length.toLocaleString());
                        console.log('   gzipped: ' + gzipResult.length.toLocaleString());
                        console.log('');

                    });

                }));

        });

        return $q.allSettled(deferreds)
            .then(function () {

                var targetPath = './target/createspace.js';

                var result = [];
                Object.keys(bundle).forEach(function (file) {
                    result.push(bundle[file]);
                });
                result = result.join('\r\n');

                $zlib.gzip(result, function (err, gzipResult) {
                    console.log('Bundle size: ' + result.length.toLocaleString());
                    console.log('   gzipped: ' + gzipResult.length.toLocaleString());
                });

                return $q.nfcall($fs.writeFile, targetPath, result)
                    .then(function () {
                        console.log('Concat done, build time: ' + (new Date().getTime() - now) + 'ms');
                    });

            });


    });


}

function uglify () {

    return $q.allSettled([
        _uglifyCss(),
        _uglifyJs()
    ]);

}

function _uglifyJs () {

    var now = new Date().getTime();

    return $globby([
        './target/csApp.js',
        './target/templatecache.js'
    ]).then(function (files) {

        var deferreds = [];
        files.forEach(function (file) {

            var minifyResult = $uglifyJs.minify(file);

            // uglifiedBundle.push(minifyfyResult.code);

            var targetPath = $path.resolve('./target', $path.basename(file));

            deferreds.push($q.nfcall($fs.writeFile, targetPath, minifyResult.code));

        });

        return $q.allSettled(deferreds)
            .then(function () {
                console.log('Uglify done, build time: ' + (new Date().getTime() - now) + 'ms');
            });

    });

}

function _uglifyCss () {

    var now = new Date().getTime();

    return $globby([
        './target/bundle.css'
    ]).then(function (files) {

        var deferreds = [];
        files.forEach(function (file) {

            var minifyResult = $uglifyCss.processFiles([file]);

            var targetPath = $path.resolve('./target', $path.basename(file));

            deferreds.push($q.nfcall($fs.writeFile, targetPath, minifyResult));

            $fs.readFile(file, function (err, result) {
                if (!err) {
                    $zlib.gzip(minifyResult, function (err, gzipResult) {

                        if (!err) {
                            console.log('File: ' + $path.relative('.', file));
                            console.log('   original size: ' + result.length);
                            console.log('   minified size: ' + minifyResult.length.toLocaleString());
                            console.log('   gzipped size: ' + gzipResult.length);
                            console.log('');
                        }

                    });
                }
            });

        });

        return $q.allSettled(deferreds)
            .then(function () {

                console.log('Uglifying done, build time: ' + (new Date().getTime() - now) + 'ms');

            });

    });

}
