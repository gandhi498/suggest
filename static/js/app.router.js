angular.module('suggest')
	.config(function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.when('', '/home');

		$stateProvider.state('home', {
			url: '/home',
			templateUrl: './templates/home.html'
		})
		.state('createSpace', {
			url: '/createSpace',
			templateUrl: './templates/create-space.html'
		})
		.state('suggestName', {
			url: '/suggestName',
			templateUrl: './templates/suggest-name.html'
		});

	});