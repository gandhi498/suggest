(function () {
	'use strict'

	angular.module('suggest')
	.config(function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.when('', '/home');

		$stateProvider.state('home', {
			url: '/home',
			templateUrl: './templates/home.html',
			controller: 'HomeController'
		})
		.state('createSpace', {
			url: '/createSpace',
			templateUrl: './templates/create-space.html',
			controller: 'CreateSpaceController'
		})
		.state('suggestName', {
			url: '/suggestName',
			templateUrl: './templates/suggest-name.html',
			controller: 'SuggestNameController'
		});

	});

}());