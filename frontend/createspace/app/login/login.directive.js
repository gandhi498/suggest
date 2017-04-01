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
        csApiLogin,
        $rootScope
    ) {

        var self = this;
        self.isLoggedIn = false;
        self.userDetails = {};
        self.loading = false;
        window.logoutUser = function () {
            FB.logout(function(response) {
                console.log("User logged out successfully");
            });
        }
        window.checkLoginState = function () {
            FB.getLoginStatus(function(response) {
                console.log(response);

                if(response.status == 'connected' && response.authResponse.userID != "") {
                    var userID = response.authResponse.userID;
                    FB.api(
                        "/"+response.authResponse.userID+"?fields=email,first_name,last_name,gender,link,picture",
                        function (response) {
                          if (response && !response.error) {
                            /* handle the result */
                            response.userID = userID;
                            handelFbResponse(response);
                          } 
                          else {
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

        var handelFbResponse = function (response) {
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

        function submit (form) {

            var userData = {};

            userData.socialData = self.userDetails;
            userData.spaceDetails = self.model;
            self.loading = true;
            
            return csApiLogin.login(userData)
                .then(_submitSuccess(form), formHandler.submitFailed(form))
                .finally(function () {
                    self.loading = false;
                });
        }

        function _submitSuccess () {

            return function (res) {
                console.log("Space created successfully: %s",JSON.stringify(res.data));
                console.log("Now need to send user to next screen");
            };

        }
    }

}
