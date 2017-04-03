(function() {
	'use strict'

	angular.module('newbie')
	.constant('ApiConstants',  {

		getSpaceDetails: '/space/add/getSpaceDetails',

		getNamesFromSpace: '/space/add/getNamesForSpace',

		vote: '/space/add/vote',

		addName: '/space/add/addName',

		getNamesForLetter: '/space/add/getNamesForLetter'

	});

})();