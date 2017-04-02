(function () {
	'use strict'

	angular.module('newbie')
	.service('SpaceService', SpaceService)

	function SpaceService ($http, $q) {

		var service = {}

		service.createSpace = createSpace
		service.getSpaceDetails = getSpaceDetails

		return service;

		function getSpaceDetails (data) {
			
			var url = 'http://www.mynewbie.in/space/add/getSpaceDetails?spaceid='+data.spaceid;
//			var url = 'http://localhost:8081/space/add/getSpaceDetails?spaceid='+data.spaceid;
			var deferred = $q.defer();

			$http({
	          method: 'GET',
	          url: url
	        })
	        .then(function (response) {

	            console.log("success :"+response);
	            deferred.resolve(response);

		    },function (error) {

	          	deferred.reject(error);
	            console.log('Sorry cannot create space %s :');

	         });

	        return deferred.promise;
		};

		function createSpace (data) {

			var url = 'http://www.mynewbie.in/space/create/createspace';
			//var url = 'http://localhost:8081/space/create/createspace';
			var deferred = $q.defer();

			$http({
	          method: 'POST',
	          url: url,
	          data: {
	            "spacename": data.name,
	            "email": data.email,
	            "name": data.createdBy,
	            "expectingNameFor": data.gender,
	            "expectingOn": data.expectingOn
	          }
	        })
	        .then(function (response) {

	            console.log("success :"+response);
	            deferred.resolve(response);

		    },function (error) {

	          	deferred.reject(error);
	            console.log('Sorry cannot create space %s :');

	         });

	        return deferred.promise;
		}
	}

	SpaceService.$inject = ['$http', '$q'];

})();

