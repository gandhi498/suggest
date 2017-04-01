'use strict';

require('./myspace.module')
    .directive('csMySpace', csMySpace);

function csMySpace () {

    return {
        restrict: 'EA',
        templateUrl: 'myspace/cs-myspace.html',
        replace: true,
        controller: Controller,
        controllerAs: 'myspace'
    };

    /* @ngInject */
    function Controller (
        $state,
        csCoreStates,
        csCoreModel,
        csForm,
        csApiMySpace,
        $rootScope
    ) {
        
    }
}