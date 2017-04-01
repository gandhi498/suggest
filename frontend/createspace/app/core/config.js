'use strict';

require('./core.module')
    .config(config);

/* @ngInject */
function config ($stateProvider, csCoreStates) {

    $stateProvider.state(csCoreStates.ROOT, {
        abstract: true,
        url: '',
        template: '<div class="cs-container__panel__content__view" ui-view></div>',
        resolve: {
           // call to backend for loading labels or initial config variables
        }
    });

    $stateProvider.state(csCoreStates.LOGIN, {
        url: '',
        template: '<div cs-login></div>'

    });

    $stateProvider.state(csCoreStates.MYSPACE, {
        url: '',
        template: '<div cs-my-space></div>'

    });


}
