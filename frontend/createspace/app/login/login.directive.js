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
        self.isLoggedIn = false;
        self.userDetails = {};
        window.checkLoginState = function () {
            FB.getLoginStatus(function(response) {
                console.log(response);

                if(response.status == 'connected' && response.authResponse.userID != "") {
                    console.log(response.authResponse.userID);
                    FB.api(
                        "/"+response.authResponse.userID+"?fields=email,first_name,last_name,gender,link",
                        function (response) {
                          if (response && !response.error) {
                            /* handle the result */
                           handelResponse(response);
                          } 
                          else {
                            alert("Sorry, error occured while fetching your data, please try again");
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

        var handelResponse = function (response) {
            self.isLoggedIn = true;
            self.userDetails = response;
            console.log(response);
            $rootScope.$apply();
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
                    530: function (form) {

                    },
                    531: function (form) {

                    },
                    9001: function (form) {
                        form.$setValidity('9001', false);
                    },
                    532: function (form) {
                        form.$setValidity('532', false);
                    },
                    required: 'required'
                },
                field: {
                    spaceName: {
                        required: 'required'
                    }
                }
            },
            nonBlockingErrors: {
                form: ['unknown_error', '001'],
                field: {
                    spaceName: ['']
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
