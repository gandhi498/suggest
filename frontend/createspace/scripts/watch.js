'use strict';

var $watch = require('node-watch');
var $debounce = require('debounce');
var $notifier = require('node-notifier');

var $bundle = require('./bundle');

module.exports = {
    watch: watch
};


if (!module.parent) {

    watch();

    console.log('Watcher started, watching for file changes --\n');

}

function watch () {

    $watch('./app', {
        recursive: true
    }, $debounce(function (file) {

        $notifier.notify({
            withFallback: true,
            title: 'Change event; ' + new Date().toTimeString().substr(0, 8),
            message: 'Watcher triggered, creating bundle',
            icon: false
        }, function () {});

        console.log('Detected change in ' + file);

        var now = new Date().getTime();

        $bundle.bundle({
            uglify: false
        }).then(function () {
            $notifier.notify({
                withFallback: true,
                title: 'Bundle created; ' + new Date().toTimeString().substr(0, 8),
                message: 'Build time: ' + (new Date().getTime() - now) + 'ms',
                icon: false
            }, function () {});
        });

    }, 250));

}



