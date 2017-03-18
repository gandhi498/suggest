'use strict';

require('./csrf.module')
    .factory('csCsrf', csCsrf);

/* @ngInject */
function csCsrf () {

    return {
        getCsrfToken: getCsrfToken,
        getCsrfHeader: getCsrfHeader,
        upgradeHttpObject: upgradeHttpObject
    };

    function getCsrfToken () {

        // get from DOM
        return document.getElementById('csrf').getAttribute('content');

    }

    function getCsrfHeader () {

        // get from DOM
        return document.getElementById('csrf_header').getAttribute('content');

    }

    function upgradeHttpObject (obj) {

        obj.headers = obj.headers || {};
        obj.headers[getCsrfHeader()] = getCsrfToken();
        return obj;

    }

}
