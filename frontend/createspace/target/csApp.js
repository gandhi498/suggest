/* istanbul ignore next */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.yes = f()}})(function(){var define,module,exports;return /* istanbul ignore next */(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./all-names.module')
    .directive('csAllNames', csAllNames);

function csAllNames() {

    Controller.$inject = ["$state", "csApiMySpace", "$rootScope", "$timeout"];
    return {
        restrict: 'EA',
        templateUrl: 'all-names/cs-all-names.html',
        replace: true,
        controller: Controller,
        controllerAs: 'allNames'
    };

    /* @ngInject */
    function Controller(
        $state,
        csApiMySpace,
        $rootScope,
        $timeout
    ) {

        var vm = this;

        vm.model = {};
        vm.model.alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        vm.model.namesList = [];
        vm.getNamesForLetter = getNamesForLetter;

        function getNamesForLetter(letter) {
            csApiMySpace.getNamesForLetter(letter)
                .then(function (success) {
                    vm.model.namesList = success.data.nameList;
                    $timeout(function () {
                        componentHandler.upgradeAllRegistered();
                    })
                }, function (error) {
                    console.log("Error occurred while getting names by letter: %s",JSON.stringify(error));
                })
        }


    }
}
},{"./all-names.module":2}],2:[function(require,module,exports){
'use strict';

module.exports = angular.module('cs.allnames', []);

},{}],3:[function(require,module,exports){
'use strict';

module.exports = angular.module('cs.api', []);

},{}],4:[function(require,module,exports){
'use strict';

factory.$inject = ["$http", "csCsrf"];
require('./api.module')
    .factory('csApiLogin', factory);

/* @ngInject */
function factory ($http, csCsrf) {

    return {
        login: login,
        getUserAndSpaceDetailsById:getUserAndSpaceDetailsById
    };


    function login (userData) {
        return $http(csCsrf.upgradeHttpObject({
            url: '/space/create/createspace',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            data: JSON.stringify(userData)
        }));

    }

    function getUserAndSpaceDetailsById (userData) {
        return $http(csCsrf.upgradeHttpObject({
            url: '/space/create/getUserAndSpaceDetailsById?userID='+userData.userID,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }));

    }

}

},{"./api.module":3}],5:[function(require,module,exports){
'use strict';

factory.$inject = ["$http", "csCsrf"];
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

},{"./api.module":3}],6:[function(require,module,exports){
'use strict';

factory.$inject = ["$http", "csCsrf"];
require('./api.module')
    .factory('csApiSession', factory);

/* @ngInject */
function factory ($http, csCsrf) {

    return {
        checkSession: checkSession
    };


    function checkSession (userData) {
        return $http(csCsrf.upgradeHttpObject({
            url: '/space/create/checksession',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }));

    }

}

},{"./api.module":3}],7:[function(require,module,exports){
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

    $stateProvider.state(csCoreStates.MYSPACE, {
        url: '',
        template: '<div cs-my-space></div>'

    });


}

},{"./core.module":9}],8:[function(require,module,exports){
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

},{"./core.module":9}],9:[function(require,module,exports){
'use strict';

module.exports = angular.module('cs.core', [
    'ui.router',
    'ngMessages',
    require('./../api/api.module').name,
    require('./../login/login.module').name,
    require('./../csrf/csrf.module').name,
    require('./../form/form.module').name,
    require('./../myspace/myspace.module').name,
    require('./../all-names/all-names.module').name,
]);

},{"./../all-names/all-names.module":2,"./../api/api.module":3,"./../csrf/csrf.module":14,"./../form/form.module":16,"./../login/login.module":18,"./../myspace/myspace.module":20}],10:[function(require,module,exports){
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


},{"./core.module":9}],11:[function(require,module,exports){
'use strict';

run.$inject = ["$rootScope", "csCoreStates"];
require('./core.module')
    .run(run);

/* @ngInject */
function run ($rootScope, csCoreStates) {

    $rootScope.STATES = csCoreStates;

}

},{"./core.module":9}],12:[function(require,module,exports){
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

},{"./core.module.js":9}],13:[function(require,module,exports){
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

},{"./csrf.module":14}],14:[function(require,module,exports){
'use strict';

module.exports = angular.module('cs.csrf', []);

},{}],15:[function(require,module,exports){
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

},{"./form.module":16}],16:[function(require,module,exports){
'use strict';

module.exports = angular.module('cs.form', []);

},{}],17:[function(require,module,exports){
'use strict';

require('./login.module')
    .directive('csLogin', csLogin);

function csLogin() {

    Controller.$inject = ["$state", "csCoreStates", "csCoreModel", "csForm", "csApiLogin", "$rootScope"];
    return {
        restrict: 'EA',
        templateUrl: 'login/cs-login.html',
        replace: true,
        controller: Controller,
        controllerAs: 'login'
    };

    /* @ngInject */
    function Controller(
        $state,
        csCoreStates,
        csCoreModel,
        csForm,
        csApiLogin,
        $rootScope
    ) {

        var self = this;
        self.isLoggedIn = false;
        self.loading = false;
        window.logoutUser = function () {
            FB.logout(function (response) {
                console.log("User logged out successfully");
            });
        }
        var fbSdkChckTmr;

        function checkFbSdk() {
            fbSdkChckTmr = setInterval(function () {
                if (window.FB) {
                    (function () {
                        FB.init({
                            appId: '1885200375089223',
                            xfbml: true,
                            version: 'v2.8'
                        });
                        FB.AppEvents.logPageView();
                        stopFbTimerFunction();
                        window.checkLoginState();
                    })();
                }
            }, 1000);
        }

        function stopFbTimerFunction() {
            clearTimeout(fbSdkChckTmr);
        }

        checkFbSdk();

        window.checkLoginState = function () {
            FB.getLoginStatus(function (response) {
                console.log(response);

                if (response.status == 'connected' && response.authResponse.userID != "") {
                    var userID = response.authResponse.userID;
                    FB.api(
                        "/" + response.authResponse.userID + "?fields=email,first_name,last_name,gender,link,picture",
                        function (response) {
                            if (response && !response.error) {
                                /* handle the result */
                                response.userID = userID;
                                handelFbResponse(response);
                            } else {
                                alert("Sorry, error occured while fetching your data from facebook, please try again");
                            }

                        }
                    );
                }
            });
        }

        var reForNumber = /^[0-9]+$/;
        var reForFbNumber = /^\d{10,12}$/;
        // this regEx from : http://emailregex.com/ : which is working fine

        var reForEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.([a-z][a-z]{1,5})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

        csCoreModel.clean();
        self.model = csCoreModel.model;
        self.model.userEmail = undefined;
        self.model.spaceName = undefined;
        self.model.expectingNameFor = undefined;
        self.model.expectingOn = undefined;
        self.model.userDetails = {};
        self.showManageSpace = false;
        var handelFbResponse = function (response) {

            csApiLogin.getUserAndSpaceDetailsById({
                    userID: response.userID
                })
                .then(function (res) {
                    //user found in the system
                    console.log(res.data);
                    if (res.data.socialDetails.fbID === response.userID) {
                        self.showManageSpace = true;
                        self.isLoggedIn = true;
                        self.model.loggedInUser = res.data;
                        updateRootScope();
                    }

                }, function () {
                    // user not found in the system
                    self.isLoggedIn = true;
                    self.showManageSpace = false;
                    self.model.userDetails = response;
                    console.log(response);
                    updateRootScope();
                });
        }

        var formHandler = csForm({
            errorMapping: {
                form: {
                    'default': function (form) {
                        form.$setValidity('unknown_error', false);
                    },
                    '001': function (form) {
                        form.$setValidity('001', false);
                    },
                    required: 'required'
                },
                field: {
                    spaceName: {
                        required: 'required'
                    },
                    expectingNameFor: {
                        required: 'required'
                    }
                }
            },
            nonBlockingErrors: {
                form: ['unknown_error', '001'],
                field: {
                    spaceName: [''],
                    expectingNameFor: ['']
                }
            },
            submit: submit
        });

        self.submit = formHandler.submit;

        function submit(form) {

            var userData = {};
            userData.socialData = self.model.userDetails;
            userData.spaceDetails = self.model;
            self.loading = true;

            return csApiLogin.login(userData)
                .then(_submitSuccess(form), formHandler.submitFailed(form))
                .finally(function () {
                    self.loading = false;
                });
        }

        function _submitSuccess() {

            return function (res) {
                console.log("Space created successfully: %s", JSON.stringify(res.data));
                console.log("Now need to send user to next screen");

                $state.go(csCoreStates.MYSPACE);
            };

        }
        var updateRootScope = function () {
            setTimeout(function () {
                $rootScope.$apply();
            }, 100);
        }

    }
}
},{"./login.module":18}],18:[function(require,module,exports){
'use strict';

module.exports = angular.module('cs.login', []);

},{}],19:[function(require,module,exports){
'use strict';

require('./myspace.module')
    .directive('csMySpace', csMySpace);

function csMySpace() {

    Controller.$inject = ["$state", "csCoreStates", "csCoreModel", "csForm", "csApiMySpace", "csApiSession", "csApiLogin", "$rootScope"];
    return {
        restrict: 'EA',
        templateUrl: 'myspace/cs-myspace.html',
        replace: true,
        controller: Controller,
        controllerAs: 'myspace'
    };

    /* @ngInject */
    function Controller(
        $state,
        csCoreStates,
        csCoreModel,
        csForm,
        csApiMySpace,
        csApiSession,
        csApiLogin,
        $rootScope
    ) {
        var self = this;

        self.model = csCoreModel.model;
        self.isSessionValid = false;
        self.showRegisterLink = false;
        self.model.fb = {username: "", profilepic:""};
        window.checkLoginStateMySpace = function () {
            FB.getLoginStatus(function (response) {
                console.log(response);

                if (response.status == 'connected' && response.authResponse.userID != "") {
                    var userID = response.authResponse.userID;
                    FB.api(
                        "/" + response.authResponse.userID + "?fields=email,first_name,last_name,gender,link,picture",
                        function (response) {
                            if (response && !response.error) {
                                /* handle the result */
                                response.userID = userID;
                                handelFbResponse(response);
                            } else {
                                alert("Sorry, error occured while fetching your data from facebook, please try again");
                            }

                        }
                    );
                }
            });
        }

        var handelFbResponse = function (response) {
            // Call here backend to get deatils of logged-in user
            console.log(JSON.stringify(response));
            csApiLogin.getUserAndSpaceDetailsById({userID:response.userID})
            .then(function(res){
                //user found in the system
                console.log(res.data);
                if(res.data.socialDetails.fbID === response.userID) {
                    self.model = res.data;
                    self.isSessionValid = true;
                    self.showRegisterLink = false;
                    updateRootScope();
                }
                
            },function(error){
                // user not found in the system
                self.model.fb.username = response.first_name + ' ' +response.last_name;
                self.model.fb.profilepic = response.picture.data.url;
                self.showRegisterLink = true;
                console.log(error);
                updateRootScope();
            });
        }

        csApiSession.checkSession()
            .then(function (res) {
                console.log("Session Check Success : %s", JSON.stringify(res.data));
                self.model = res.data;
                self.isSessionValid = true;
                updateRootScope();

            }, function (res) {
                console.log("Session Check Failed : %s", JSON.stringify(res.data));
                self.isSessionValid = false;
                //Init FB
                (function () {
                FB.init({
                    appId: '1885200375089223',
                    xfbml: true,
                    version: 'v2.8'
                });
                FB.AppEvents.logPageView();
                checkLoginStateMySpace();
                })();
                updateRootScope();
            });

        var updateRootScope = function () {
            setTimeout(function () {
                $rootScope.$apply();
            }, 100);
            window.scrollTo(0, 0);
        }

    }
}

},{"./myspace.module":20}],20:[function(require,module,exports){
'use strict';

module.exports = angular.module('cs.myspace', []);

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])(20)
});