(function() {
	'use strict'

	angular.module('newbie')
	.constant('ApiConstants',  {

		getSpaceDetails: '/getSpaceDetails',

		getNamesFromSpace: '/getNamesForSpace',

		vote: '/vote',

		addName: '/addname'

	});

})();