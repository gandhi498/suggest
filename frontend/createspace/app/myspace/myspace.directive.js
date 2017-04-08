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
