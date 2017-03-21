/* istanbul ignore next */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.yes = f()}})(function(){var define,module,exports;return /* istanbul ignore next */(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = angular.module('cs.api', []);

},{}],2:[function(require,module,exports){
'use strict';

factory.$inject = ["$http", "csCsrf"];
require('./api.module')
    .factory('csApiLogin', factory);

/* @ngInject */
function factory ($http, csCsrf) {

    return {
        login: login
    };


    function login (userData) {
        return $http(csCsrf.upgradeHttpObject({
            url: 'create/space/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            data: JSON.stringify(userData)
        }));

    }

}

},{"./api.module":1}],3:[function(require,module,exports){
'use strict';

config.$inject = ["$stateProvider", "csCoreStates"];
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

}

},{"./core.module":5}],4:[function(require,module,exports){
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

},{"./core.module":5}],5:[function(require,module,exports){
'use strict';

module.exports = angular.module('cs.core', [
    'ui.router',
    'ngMessages',
    require('./../api/api.module').name,
    require('./../login/login.module').name,
    require('./../csrf/csrf.module').name,
    require('./../form/form.module').name
]);

},{"./../api/api.module":1,"./../csrf/csrf.module":10,"./../form/form.module":12,"./../login/login.module":14}],6:[function(require,module,exports){
'use strict';

require('./core.module')
    .factory('csCoreModel', csCoreModel);

function csCoreModel () {

    var factory = {
        model: {},
        clean: clean
    };

    return factory;

    function clean (preserveFields) {

        if (preserveFields && !angular.isArray(preserveFields)) {
            throw '"fields" (if provided) must be an array';
        }

        for (var key in factory.model) {
            /* istanbul ignore else */
            if (factory.model.hasOwnProperty(key)) {

                if (!preserveFields || preserveFields.indexOf(key) === -1) {
                    delete factory.model[key];
                }

            }
        }

    }
}


},{"./core.module":5}],7:[function(require,module,exports){
'use strict';

run.$inject = ["$rootScope", "csCoreStates"];
require('./core.module')
    .run(run);

/* @ngInject */
function run ($rootScope, csCoreStates) {

    $rootScope.STATES = csCoreStates;

}

},{"./core.module":5}],8:[function(require,module,exports){
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

},{"./core.module.js":5}],9:[function(require,module,exports){
'use strict';

require('./csrf.module')
    .factory('csCsrf', csCsrf);

/* @ngInject */
function csCsrf () {

    return {
        getCsrfToken: getCsrfToken,
        getCsrfHeader: getCsrfHeader,
        upgradeHttpObject: upgradeHttpObject
    };

    function getCsrfToken () {

        // get from DOM
        return document.getElementById('csrf').getAttribute('content');

    }

    function getCsrfHeader () {

        // get from DOM
        return document.getElementById('csrf_header').getAttribute('content');

    }

    function upgradeHttpObject (obj) {

        obj.headers = obj.headers || {};
        obj.headers[getCsrfHeader()] = getCsrfToken();
        return obj;

    }

}

},{"./csrf.module":10}],10:[function(require,module,exports){
'use strict';

module.exports = angular.module('cs.csrf', []);

},{}],11:[function(require,module,exports){
'use strict';

csForm.$inject = ["$rootScope", "$q"];
require('./form.module')
    .factory('csForm', csForm);

/* @ngInject */
function csForm ($rootScope, $q) {

    var factory = createInstance;
    factory.FormHandler = FormHandler;
    factory.setInvalid = setInvalid;

    return factory;

    function createInstance (config) {
        return new FormHandler(config);
    }

    function FormHandler (config) {

        if (this instanceof FormHandler === false) {
            return new FormHandler(config);
        }

        var self = this;

        self.submitting = false;

        config = config || {};

        self.errorMapping = config.errorMapping || {};
        self.fieldMapping = config.fieldMapping || {};
        self.nonBlockingErrors = config.nonBlockingErrors || {};

        // required!
        self.userSubmit = config.submit;

        self.submit = submit;
        self.preSubmit = preSubmit;
        self.postSubmit = postSubmit;

        self.submitFailed = submitFailed;

        function preSubmit (form, e) {

            var deferred = $q.defer();

            // prevent double submits
            if (self.submitting) {
                deferred.reject('form already submitting');
            }
            else {

                // clear any non-blocking errors before continuing
                if (self.nonBlockingErrors.form) {
                    for (var i = 0, iMax = self.nonBlockingErrors.form.length; i < iMax; i++) {
                        form.$setValidity(self.nonBlockingErrors.form[i], true);
                    }
                }

                // process fields
                for (var fieldName in self.nonBlockingErrors.field) {
                    /* istanbul ignore else */
                    if (self.nonBlockingErrors.field.hasOwnProperty(fieldName)) {

                        for (var j = 0, jMax = self.nonBlockingErrors.field[fieldName].length; j < jMax; j++) {
                            form[fieldName].$setValidity(self.nonBlockingErrors.field[fieldName][j], true);
                        }

                    }
                }

                // mark form as being submitted so errors can be shown
                form.$submitted = true;

                // patch ng 1.2 to act like ^1.3
                angular.element(e.target).addClass('ng-submitted');

                // revalidate the form so any hidden errors are triggered
                _revalidate(form);

                // only actually do something if the form is valid
                if (form.$invalid) {
                    deferred.reject('form invalid');
                }
                else {

                    // set submitting flag
                    self.submitting = true;

                    deferred.resolve(form);

                }

            }

            return deferred.promise;

        }

        function submit (form, e) {


            return preSubmit(form, e)
                .then(self.userSubmit)
                ['finally'](postSubmit);

        }

        function postSubmit () {

            // reset submitting flag
            self.submitting = false;

        }

        function submitFailed (form) {

            return function (res) {

                var deferred = $q.defer();

                var responseData = res.data;
                if (responseData.errorDetails && responseData.errorDetails.length) {
                    for (var i = 0, iMax = responseData.errorDetails.length; i < iMax; i++) {

                        var errorCode;
                        var error = responseData.errorDetails[i];

                        if (error.field) {

                            // field specific error
                            self.errorMapping.field = self.errorMapping.field || {};
                            self.errorMapping.field[error.field] = self.errorMapping.field[error.field] || {};
                            errorCode = self.errorMapping.field[error.field][error.code];

                            if (typeof errorCode === 'string') {
                                form[error.field].$setValidity(errorCode, false);
                            }
                            else if (typeof errorCode === 'function') {
                                // execute and provide form as argument
                                errorCode(form, error);
                            }
                            else {
                                // error response cannot be mapped! not good, but do nothing.
                            }
                        }
                        else {
                            // form error
                            self.errorMapping.form = self.errorMapping.form || {};
                            errorCode = self.errorMapping.form[error.code] || self.errorMapping.form['default'];

                            if (typeof errorCode === 'string') {
                                form.$setValidity(errorCode, false);
                            }
                            else if (typeof errorCode === 'function') {
                                // execute and provide form as argument
                                errorCode(form, error);
                            }
                            else {
                                // error response cannot be mapped! not good, but do nothing.
                            }
                        }

                    }
                }

                deferred.reject(res);

                return deferred.promise;

            };

        }

        function _revalidate (form) {

            for (var key in form) {
                /* istanbul ignore else */
                if (form.hasOwnProperty(key)) {

                    if (key.charAt(0) !== '$') {

                        if (typeof form[key].$setViewValue !== 'undefined') {
                            // trigger revalidation
                            form[key].$setViewValue(form[key].$viewValue);
                        }
                        else {
                            // call recursively
                            _revalidate(form[key]);
                        }

                    }

                }

            }

        }

    }

    function setInvalid (controller, error) {

        controller.$setValidity(error, false);

        return {
            until: until
        };

        function until (validationFunction, watchReturnFunction) {

            // determine whether we're playing with a modelController or formController
            if (controller.hasOwnProperty('$viewValue')) {
                // model controller


            }
            else if (controller.hasOwnProperty('$addControl')) {
                // form controller
            }

            var removeWatcher = $rootScope.$watch(function () {
                if (controller.$valid) {
                    removeWatcher();
                }

                return watchReturnFunction ? watchReturnFunction() : controller.$viewValue;
            }, function (newValue) {

                if (validationFunction(newValue)) {
                    controller.$setValidity(error, true);
                    removeWatcher();
                }

            });

        }
    }

}

},{"./form.module":12}],12:[function(require,module,exports){
'use strict';

module.exports = angular.module('cs.form', []);

},{}],13:[function(require,module,exports){
'use strict';

require('./login.module')
    .directive('csLogin', csLogin);

function csLogin () {

    Controller.$inject = ["$state", "csCoreStates", "csCoreModel", "csForm", "$rootScope"];
    return {
        restrict: 'EA',
        templateUrl: 'login/cs-login.html',
        replace: true,
        controller: Controller,
        controllerAs: 'login'
    };

    /* @ngInject */
    function Controller (
        $state,
        csCoreStates,
        csCoreModel,
        csForm,
        $rootScope
    ) {

        var self = this;
        window.checkLoginState = function () {
            FB.getLoginStatus(function(response) {
                console.log(response);
              });
        }
        var reForNumber = /^[0-9]+$/;
        var reForFbNumber = /^\d{10,12}$/;
        // this regEx from : http://emailregex.com/ : which is working fine

        var reForEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.([a-z][a-z]{1,5})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

        csCoreModel.clean();
        self.model = csCoreModel.model;
        self.model.username = undefined;
        self.model.password = undefined;

        var formHandler = csForm({
            errorMapping: {
                form: {
                    'default': function (form) {

                        form.$setValidity('unknown_error', false);

                        form.password.$setViewValue('');
                        form.password.$setValidity('required', false);
                        form.password.$render();
                    },
                    '001': function (form) {

                        // login not ok
                        form.$setValidity('001', false);

                        form.password.$setViewValue('');
                        form.password.$setValidity('required', false);
                        form.password.$render();
                    },
                    530: function (form) {

                    },
                    531: function (form) {

                    },
                    9001: function (form) {

                        form.$setValidity('9001', false);

                        form.password.$setViewValue('');
                        form.password.$setValidity('required', false);
                        form.password.$render();
                    },
                    532: function (form) {

                        form.$setValidity('532', false);

                        form.password.$setViewValue('');
                        form.password.$setValidity('required', false);
                        form.password.$render();
                    },
                    required: 'required'
                },
                field: {
                    username: {
                        required: 'required'
                    },
                    password: {
                        required: 'required'
                    }
                }
            },
            nonBlockingErrors: {
                form: ['unknown_error', '001', '530', '531', '532', '9001'],
                field: {
                    username: ['']
                }
            },
            submit: submit
        });

        self.submit = formHandler.submit;

        function submit (form) {

            

        }

        function _submitSuccess () {

            return function (res) {

            };

        }
    }

}

},{"./login.module":14}],14:[function(require,module,exports){
'use strict';

module.exports = angular.module('cs.login', []);

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14])(14)
});