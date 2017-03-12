(function () {
'use strict'

angular.module('suggest')
	.controller('CreateSpaceController', CreateSpaceController)


  function CreateSpaceController ($scope, $http, $window, $document, SpaceService) {

    $scope.spaceData = {};
    $scope.spaceLink = "";
    $scope.isSpaceCreated = false;   
		    
    $scope.createSpace = function () {
      
      //create space start
      if ($scope.spaceData.name !== "" && $scope.spaceData.email !== "") {
      console.log("Create Space for spacename : " + $scope.spaceData.name + " & email: " + $scope.spaceData.email);
      //service call for crating space
      SpaceService.createSpace($scope.spaceData)
        .then(function (response) {
          console.log('success of createspace');
          if (response.data) {
            if (response.data.status == 'OK') {
               $scope.isSpaceCreated = true;
               $scope.spaceLink = "somethjing/somethjiorty/ngndfj"
              // window.sessionStorage.setItem('spacename', $scope.spacename);
              // window.sessionStorage.setItem('spaceId', $scope._id);
            }
          }
        }, function (error) {
          console.log('error of createspace '+error);
        });       
      }
      //end

    };

    $scope.copyLink = function () {

      //link to be copied
      var link = $document.getElementsByClassName('spaceLink');

      //steps to execute copy
      var range = $document.createRange();  
      range.selectNode(link[0]);  
      $window.getSelection().addRange(range);
      $document.execCommand('copy'); 
      $window.getSelection().removeAllRanges();  

    };

  }

  CreateSpaceController.$inject = ['$scope', '$http', '$window', '$document', 'SpaceService'];
  
}());