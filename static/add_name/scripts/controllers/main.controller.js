angular.module('newbie')
.controller('MainController', MainController)

function MainController($scope, SpaceService) {
	$scope.spaceUrl = "jdsk/djf/";
	var data = {
		name: 'Divya Test 3',
		email: 'divya@test3.com',
		createdBy: 'Divya',
		expectedOn: '26/07/2019',
		gender: 'Either'
	};

	$scope.createSpace = function() {
		SpaceService.createSpace(data)
        .then(function (response) {
          console.log('success of createspace');
          if (response.data) {
            if (response.data.status == 'OK') {
              
               $scope.spaceUrl = response.data.spaceurl;
              
            }
          }
        }, function (error) {
          console.log('error of createspace '+error);
        });  
	}
}

MainController.$inject = ['$scope', 'SpaceService']