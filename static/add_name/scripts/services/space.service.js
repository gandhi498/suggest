(function () {
	'use strict'

	angular.module('newbie')
	.service('SpaceService', SpaceService)

	function SpaceService ($http, $q, ApiConstants) {

		var service = {}
		
		service.getSpaceDetails = getSpaceDetails

		return service;

		function getSpaceDetails (data) {			
			
     		var url = ApiConstants.getSpaceDetails + '?spaceid='+ data.spaceid;
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
		
	}

	SpaceService.$inject = ['$http', '$q', 'ApiConstants'];

})();

