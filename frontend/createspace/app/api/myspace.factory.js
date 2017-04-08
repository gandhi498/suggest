'use strict';

require('./api.module')
    .factory('csApiMySpace', factory);

/* @ngInject */
function factory ($http, csCsrf) {

    return {
        addName: addName,
        getNamesForLetter: getNamesForLetter
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

    function getNamesForLetter (letter) {
       
        return $http(csCsrf.upgradeHttpObject({
            url: '/space/add/getNamesForLetter?letter='+letter,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }));
    }

}
