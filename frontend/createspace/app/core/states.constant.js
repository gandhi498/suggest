'use strict';

require('./core.module.js')
    .constant('csCoreStates', csCoreStates());

function csCoreStates () {

    var states = {};
    states.ROOT = 'container';
    states.LOGIN = _join(states.ROOT, 'login');
    return states;

    function _join () {

        return Array.prototype.slice.call(arguments).join('.');

    }

}
