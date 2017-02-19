//var socket = io.connect('http://localhost:8081');
// 		  socket.on('news', function (data) {
// 		    console.log(data);
// 		    socket.emit('my other event', { my: 'data' });
// });

var app = angular.module("cabin_iot", ['ui.router', 'ui.bootstrap']);
var api = {
	"createspace" : "/createspace",
	"addname" : "/addname",
	"getNamesForSpace" : "/getNamesForSpace",
	"dashboard" : "/dashboard",
	"name" : "/name",
	"vote": "/vote"
}

var userData = {};

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/createSpace');

    $stateProvider
			.state('createSpace', {
						url: '/createSpace',
						templateUrl: '../templates/createSpace.html',
						controller: 'createSpace'
				})
			.state('suggestName', {
            url: '/suggestName',
            templateUrl: '../templates/suggestName.html',
            controller: 'suggestName'
        })
			.state('suggest', {
            url: '/suggest/:id',
            templateUrl: '../templates/error.html',
            controller: 'deeplink'
        })
			.state('vote', {
            url: '/suggest/:id/vote/:count',
            templateUrl: '../templates/suggestName.html',
            controller: 'vote'
        })
    	.state('dashboard', {
            url: '/dashboard',
            templateUrl: '../templates/dashboard.html',
            controller: 'dashboard'
        })
			.state('names', {
            url: '/names',
            templateUrl: '../templates/names.html',
            controller: 'names'
        })
});


app.controller('deeplink', function ($scope, $http, $state, $stateParams) {
	var id = $stateParams.id;
  console.log('Retrieving wine stateParams : ' + id);
	if (id != undefined || id != "") {
		window.sessionStorage.setItem('spacename', id);
		$state.go('suggestName');
	} else {
			$scope.responseData = "Sorry space nout found. contact us @ suggst@gmail.com";
	}

});

app.controller('vote', function ($scope, $http, $state, $stateParams) {
	var id = $stateParams.id;
	var likesCount = $stateParams.count;
  console.log('update vote %s for id %s ', likesCount, id);
	if (id != undefined || id != "") {
		//window.sessionStorage.setItem('spacename', id);
		$state.go('suggestName');
	} else {
			$scope.responseData = "Sorry space nout found. contact us @ suggst@gmail.com";
	}

});

app.controller('createSpace', function ($scope, $http, $state) {

	$scope.createSpace = function () {
    if ($scope.spacename !== "" && $scope.email !== "") {
      console.log("Create Space for spacename : " + $scope.spacename + " & email: " + $scope.email);
      $http({
        method: 'POST',
        url: api.createspace,
        data: {
          "spacename": $scope.spacename,
          "email": $scope.email,
          "name": $scope.name,
          "expectingNameFor": $scope.gender,
          "expectingOn": $scope.expectingOn
        }
      }).then(function successCallback (response) {
          console.log("postive");
          if (response.data) {
            if (response.data.status == 'OK') {
              window.sessionStorage.setItem('spacename', $scope.spacename);
              window.sessionStorage.setItem('spaceId', $scope._id);

              $state.go('suggestName');
            }
          }
        },
        function () {
          alert('Sorry cannot create space %s :', $scope.spacename);
        });
    }
	}
});

app.controller('suggestName', function ($scope, $http, $state, $uibModal) {

	// Getting name list - G1
  var spacenameSession = window.sessionStorage.getItem('spacename');
	$http({
					method: 'GET',
					url: "/getNamesForSpace?spacename="+spacenameSession
	 }).then(function(response) {
			$scope.spaceOverview = response.data;
	 },function () {
			alert("Error retrieving list of name for space %s : ", spacenameSession);
	 });

	// END - G1

	// Adding name to database
	var _addName = function (formData) {
		if(formData.babyName !== "" && formData.meaning !== "") {
			console.log("Adding to spacename : " + $scope.spacename + "  name: " + formData.babyName);
			$http({
	          method: 'POST',
	          url: api.addname,
	          data: {
	          	"spacename":window.sessionStorage.getItem('spacename'),
	          	"babyname":formData.babyName,
							"meaning":formData.meaning,
							"gender": formData.gender,
							"addedBy": formData.addedBy
	          }
	        }).then(function successCallback(response) {
						console.log("1:%s",response.data);
	        			if(response.data)
	        			{
	        				if(response.data.status == 'OK') {
										$scope.responseData = "Success";

	        					$state.go('suggestName');
	        				}
	        			}
	              	},
	              	function(){
	              		alert('Sorry couldnt add name ');
	              	});
		}
	}
	//End

	//Open modal to add name
	$scope.openModal = function (gender) {

		console.log('gender :'+gender);
		//$scope.gender = gender;

		var suggestNameModal = $uibModal.open({
			animation: true,
      		ariaLabelledBy: 'modal-title',
      		ariaDescribedBy: 'modal-body',
      		templateUrl: 'suggestNameModal.html',
      		controller: 'suggestNameModalController',
      		resolve:  {
      			gender: function() {
      				return gender;
      			}
      		}

		});

		suggestNameModal.result.then(function (formData) {
	       console.log('ok form data : '+JSON.stringify(formData));
	       _addName(formData);
	    }, function () {
	       console.log('Modal dismissed at: ' + new Date());
	    });

	}
	//End


	$scope.doVote = function (nameOb) {
		nameOb.likes++;
		console.log( ' -*^update vote '+ nameOb.likes + nameOb._id);

		$http({
					method: 'POST',
					url: api.vote,
					data: {
						"likes":nameOb.likes,
						"spacename":nameOb.spacename,
							"babyname":nameOb.babyname
					}
				}).then(function successCallback(response) {
					console.log("update vote response :%s", response.data);
				});


	}

	$scope.updateVote = function () {
		var spaceIdSession = window.sessionStorage.getItem('spaceId');

			console.log("vote for spacename : " + $scope._id + "  spaceIdSession: " + spaceIdSession);
			$http({
	          method: 'POST',
	          url: api.vote,
	          data: {
	          	"spacename":window.sessionStorage.getItem('spacename'),
	          	"id":spaceIdSession
	          }
	        }).then(function successCallback(response) {
						console.log("update vote response :%s", response.data);
					});
		}

});

app.controller('dashboard', function ($scope, $http, $state) {

	// Getting name list - G1
	var totalSpace = 0;
	var totalUniqueName = 0;
	console.log("in");

	$http({
					method: 'GET',
					url: "/dashboard"
	 }).then(function successCallback(response) {
		 console.log(response.data);
			$scope.overview = response.data;
	 },function () {
			alert("Error occured");
	 });

	// END - G1

});


// Modal instance Controller
app.controller('suggestNameModalController', function ($uibModalInstance, $scope, $http, gender) {
	console.log('gender in modal instance : '+gender);
	$scope.data = {};
	$scope.data.gender = gender;

	$scope.addName = function () {
		console.log('addname and return data to modal controller');
		$uibModalInstance.close($scope.data);
	}

   	$scope.cancel = function () {
   		console.log('addname and return data to modal controller');
    	$uibModalInstance.dismiss('cancel');
  	};
});
//End

app.controller('names', function ($scope, $http, $state, $stateParams) {

	console.log("fetching data for names page");


	$http({
					method: 'GET',
					url: "/name?char=a"
	 }).then(function successCallback(response) {
		 console.log(response.data);
			$scope.nameList = response.data.nameList;
	 },function () {
			alert("Error occured");
	 });

	var alphaList = ["a", "B", "C"];
	$scope.alphaList = alphaList;
	$state.go('names');

	$scope.select = function(char) {
		$scope.selectedItem = char;
		console.log("getting names for char %s", char);

		$http({
						method: 'GET',
						url: "/name?char="+char
		 }).then(function successCallback(response) {
			 console.log(response.data);
				$scope.nameList = response.data.nameList;
		 },function () {
				alert("Error occured");
		 });
	 };

});
