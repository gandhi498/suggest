(function () {
	'use strict'

	angular.module('suggest')
	.service('SpaceService', SpaceService)

	function SpaceService ($http, $q) {

		var service = {}

		service.createSpace = createSpace

		return service;

		function createSpace (data) {

			var url = '/createspace';
			var deferred = $q.defer();

			$http({
	          method: 'POST',
	          url: '/createspace',
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

}());

