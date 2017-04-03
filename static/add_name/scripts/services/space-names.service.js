(function () {
	'use strict'

	angular.module('newbie')
	.service('SpaceNamesService', SpaceNamesService)

	function SpaceNamesService ($http, $q, ApiConstants) {

		var service = {}

		service.getNamesForSpace = getNamesForSpace
		service.vote = vote
		service.addName = addName

		return service;


		function getNamesForSpace (data) {

			var url = ApiConstants.getNamesFromSpace + '?spaceid='+ data.spaceid;			
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

		function addName (data) {
			
			var url = ApiConstants.addName;	
			var deferred = $q.defer();

			$http({
	          method: 'POST',
	          url: url,
	          data: data
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

		function vote (data) {

			var url = ApiConstants.vote;			
			var deferred = $q.defer();

			$http({
	          method: 'POST',
	          url: url,
	          data: data
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

	SpaceNamesService.$inject = ['$http', '$q', 'ApiConstants'];

}());

