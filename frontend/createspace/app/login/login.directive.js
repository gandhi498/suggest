'use strict';

require('./login.module')
    .directive('csLogin', csLogin);

function csLogin () {

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
