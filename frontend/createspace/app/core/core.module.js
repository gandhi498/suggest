'use strict';

module.exports = angular.module('cs.core', [
    'ui.router',
    'ngMessages',
    require('./../api/api.module').name,
    require('./../login/login.module').name,
    require('./../csrf/csrf.module').name,
    require('./../form/form.module').name,
    require('./../myspace/myspace.module').name,
]);
