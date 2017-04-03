'use strict';

require('./myspace.module')
    .directive('csMySpace', csMySpace);

function csMySpace() {

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
        $rootScope
    ) {
        var self = this;

        self.model = csCoreModel.model;
        self.isSessionValid = false;

        self.checkLoginState = function () {
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
