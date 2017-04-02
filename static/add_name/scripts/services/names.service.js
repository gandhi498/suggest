(function () {
	'use strict'

	angular.module('newbie')
	.service('NamesService', NamesService)

	function NamesService ($http, $q) {

		var service = {}

		service.getNamesForLetter = getNamesForLetter
		
		return service;

		function getNamesForLetter (data) {

			var url = 'http://www.mynewbie.in/space/add/getNamesForLetter?letter='+data;
			//var url = 'http://localhost:8081/space/add/getNamesForLetter?letter='+data;
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
	            console.log('Sorry cannot find names :');

	         });

	        return deferred.promise;
		};
		
	}

	NamesService.$inject = ['$http', '$q'];

})();

