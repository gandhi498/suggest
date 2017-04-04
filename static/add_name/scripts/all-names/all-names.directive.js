(function() {
	'use strict'

	angular.module('newbie')
	.directive('allNames', allNames)

	allNames.$inject = ['$timeout', '$anchorScroll', 'NamesService'];

	function allNames($timeout, $anchorScroll, NamesService) {

		return {

			restrict: 'A',
			templateUrl: 'scripts/all-names/all-names.html',
			controller: allNamesController,
			controllerAs: 'allNames'

		}

		function allNamesController() {
			console.log('all names controller');
			var vm = this;
			var _scrollTo = _scrollTo;

			vm.model = {};
			vm.model.alphabets = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
			vm.model.namesList = [];
			vm.model.isSuggestionOpen = false;
			vm.model.suggestionLabel = 'Do you want some Suggestion ? Click here !!';
			vm.getNamesForLetter = getNamesForLetter;
			vm.showSuggestion = showSuggestion;

			function _scrollTo(id) {

				$timeout(function() {
					$anchorScroll(id);
					//scope.$apply();
				}, 100);

			}

			function showSuggestion() {
				console.log('showSuggestion');
				vm.model.isSuggestionOpen = !vm.model.isSuggestionOpen;
				console.log(vm.model.isSuggestionOpen);
				vm.model.suggestionLabel = vm.model.isSuggestionOpen ? 'Hide Suggestion' : 'Do you want some Suggestion ? Click here !!';
				_scrollTo('allNamesList');
				getNamesForLetter('A');

			}

		
			function getNamesForLetter(letter) {
				NamesService.getNamesForLetter(letter)
				.then(function (success) {
					vm.model.namesList = success.data.nameList;								
					$timeout(function() {
		            	componentHandler.upgradeAllRegistered();
		        	})
				}, function (error) {

				})
			}
			
		}

	}
})();