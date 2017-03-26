angular.module('newbie')
.config(function ($routeProvider, $locationProvider) {
	console.log('router')
	$routeProvider
		.when('/mySpace/:spaceId', {			
			templateUrl: '/space/add/templates/space-names.html',
			controller: 'GetNamesFromSpaceController',
		});

	//$locationProvider.html5Mode(true);
});