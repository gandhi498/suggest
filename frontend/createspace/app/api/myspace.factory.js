'use strict';

require('./api.module')
    .factory('csApiMySpace', factory);

/* @ngInject */
function factory ($http, csCsrf) {

    return {
        addName: addName
    };


    function addName (userData) {
        return $http(csCsrf.upgradeHttpObject({
            url: '/space/add/addName',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            data: JSON.stringify(userData)
        }));

    }

}
