'use strict';

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
