'use strict';

require('./core.module')
    .directive('csCoreContainer', csCoreContainer);

function csCoreContainer () {

    return {
        restrict: 'EA',
        templateUrl: 'core/cs-core-container.html',
        transclude: true,
        replace: true
    };

}
