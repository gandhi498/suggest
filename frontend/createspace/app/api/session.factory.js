'use strict';

require('./api.module')
    .factory('csApiSession', factory);

/* @ngInject */
function factory ($http, csCsrf) {

    return {
        checkSession: checkSession
    };


    function checkSession (userData) {
        return $http(csCsrf.upgradeHttpObject({
            url: '/space/create/checksession',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }));

    }

}
