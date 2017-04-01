'use strict';

require('./core.module.js')
    .constant('csCoreStates', csCoreStates());

function csCoreStates () {

    var states = {};
    states.ROOT = 'container';
    states.LOGIN = _join(states.ROOT, 'login');
    states.MYSPACE = _join(states.ROOT, 'mySpace');
    return states;

    function _join () {

        return Array.prototype.slice.call(arguments).join('.');

    }

}
