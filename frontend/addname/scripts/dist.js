'use strict';

var $path = require('path');
var $fs = require('fs');

var $q = require('q');
var $upTheTree = require('up-the-tree');
var $globby = require('globby');
var $rimraf = require('rimraf');

module.exports = {
    dist: dist
};

if (!module.parent) {

    console.log('Creating dist..');

    dist()
        .then(function () {
            console.log('Finished creating dist.');

        }).catch(function (err) {
            setTimeout(function () { throw err; }, 0);
        });
}

function dist () {

    console.log('running dist');
    return cleanDist()
        .then(copy);

}

function cleanDist () {

    var target = './' + $path.relative('.', $path.resolve($upTheTree(), 'dist')) + '/**/*';

    return $q.nfcall($rimraf, target);

}

function copy () {

    var glob = [
        './target/createspace.js',
        './target/*.css'

    ];

    return $globby(glob)
        .then(function (files) {

            var deferreds = [];

            files.forEach(function (file) {

                var promise = $q.nfcall($fs.readFile, file)
                    .then(function (buffer) {

                        var target = $path.resolve($upTheTree(), 'dist', $path.basename(file));
                        return $q.nfcall($fs.writeFile, target, buffer);

                    });

                deferreds.push(promise);

            });

            return $q.all(deferreds);

        });

}