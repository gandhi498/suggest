'use strict';

require('./api.module')
    .factory('csApiLogin', factory);

/* @ngInject */
function factory ($http, csCsrf) {

    return {
        login: login,
        getUserAndSpaceDetailsById:getUserAndSpaceDetailsById
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

    function getUserAndSpaceDetailsById (userData) {
        return $http(csCsrf.upgradeHttpObject({
            url: '/space/create/getUserAndSpaceDetailsById?userID='+userData.userID,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }));

    }

}
