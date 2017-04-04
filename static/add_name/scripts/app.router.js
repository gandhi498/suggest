(function() {
	'use strict'

	angular.module('newbie')
	.config(function ($routeProvider, $locationProvider) {
		
		$routeProvider
			.when('/:spaceId', {			
				templateUrl: '/space/add/templates/space-names.html',
				controller: 'GetNamesFromSpaceController',
				controllerAs: 'getNamesForSpace'
			});
	});

})();

