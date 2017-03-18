'use strict';

require('./core.module')
    .run(run);

/* @ngInject */
function run ($rootScope, csCoreStates) {

    $rootScope.STATES = csCoreStates;

}
