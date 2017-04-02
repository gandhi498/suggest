(function () {
	'use strict'

	angular.module('newbie')
	.service('SpaceNamesService', SpaceNamesService)

	function SpaceNamesService ($http, $q, ApiConstants) {

		var service = {}

		service.getSpaceDetails = getSpaceDetails
		service.getNamesForSpace = getNamesForSpace
		service.vote = vote
		service.addName = addName

		return service;


		function getSpaceDetails (data) {
			// need to check abt url with harshad
			var url = 'http://www.mynewbie.in/space/add/getSpaceDetails?spaceid='+data.spaceid;
			//var url = 'http://localhost:8081/space/add/getSpaceDetails?spaceid='+data.spaceid;
			//var url = ApiConstants.getSpaceDetails + '?spaceid='+ data.spaceid;
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

		function getNamesForSpace (data) {

			// need to check abt url with harshad
			//var url = ApiConstants.getNamesFromSpace + '?spaceid='+ data.spaceid;
			var url = 'http://www.mynewbie.in/space/add/getNamesForSpace?spaceid='+data.spaceid;
			//var url = 'http://localhost:8081/space/add/getNamesForSpace?spaceid='+data.spaceid;
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

			// need to check abt url with harshad
			//var url = ApiConstants.addname;
			var url = 'http://www.mynewbie.in/space/add/addname';
			//var url = 'http://localhost:8081/space/add/addname';
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

			// need to check abt url with harshad
			//var url = ApiConstants.vote;
			var url = 'http://www.mynewbie.in/space/add/vote';
			//var url = 'http://localhost:8081/space/add/vote';
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

