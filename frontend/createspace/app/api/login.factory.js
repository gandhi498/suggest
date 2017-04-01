'use strict';

require('./api.module')
    .factory('csApiLogin', factory);

/* @ngInject */
function factory ($http, csCsrf) {

    return {
        login: login
    };


    function login (userData) {
        return $http(csCsrf.upgradeHttpObject({
            url: '/space/create/createspace',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            data: JSON.stringify(userData)
        }));

    }

}
