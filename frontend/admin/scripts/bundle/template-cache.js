/* globals angular */
'use strict';

var $path = require('path');
var $fs = require('fs');

var $q = require('q');
var $upTheTree = require('up-the-tree');
var $globStream = require('glob-stream');

module.exports = {
    templateCache: templateCache
};

if (!module.parent) {
    templateCache();
}

function templateCache () {

    var now = new Date().getTime();
    var deferred = $q.defer();

    var projectRoot = $path.relative('.', $upTheTree());

    var stream = $globStream.create([
        '.' + projectRoot.split($path.sep).join('/') + '/app/**/*.html'
    ]);

    var injectables = {};

    var deferreds = [];

    stream.on('data', function (file) {

        var deferred = $q.defer();
        deferreds.push(deferred.promise);

        var templateUrl = $path.relative(file.base, file.path).split($path.sep).join('/');
        $fs.readFile(file.path, function (err, result) {
            if (err) {
                deferred.reject(err);
            }
            else {
                injectables[templateUrl] = result.toString();
                deferred.resolve();
            }
        });


    });

    stream.on('end', function () {

        $q.allSettled(deferreds)
            .then(function () {

                var tpl = _template.toString().split('\n');

                // remove first and last line of template function
                tpl.pop();
                tpl.shift();

                tpl = tpl.join('\n').replace('\'%s\'', JSON.stringify(injectables));

                $fs.writeFile($path.resolve(projectRoot, 'target/templatecache.js'), tpl, function (err) {
                    if (err) {
                        deferred.reject(err);
                    }
                    else {
                        console.log('Template-cache done, build time: ' + (new Date().getTime() - now) + 'ms');
                        deferred.resolve();
                    }
                });

            });

    });

    return deferred.promise;
}

// this is the actual template for the generated module
function _template () {

    (function (templates) {

        angular.module('cs.core')
            .run(['$templateCache', run]);

        function run ($templateCache) {

            for (var key in templates) {
                /* istanbul ignore else */
                if (templates.hasOwnProperty(key)) {
                    $templateCache.put(key, templates[key]);
                }
            }

        }

    }('%s'));

}
