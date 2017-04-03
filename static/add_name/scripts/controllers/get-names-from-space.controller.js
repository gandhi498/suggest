(function() {

	'use strict'

	angular.module('newbie')
	.controller('GetNamesFromSpaceController', GetNamesFromSpaceController)

	

	function GetNamesFromSpaceController($scope, _, $routeParams, $timeout, $window, $document, $anchorScroll, SpaceService, SpaceNamesService, NamesService, TabsFactory) {
		console.log('GetNamesFromSpaceController');

		var _init =  _init;
		var _getNames = _getNames;
		var _spaceId = $routeParams.spaceId;
		console.log('routeParams : '+$routeParams.spaceId);


		$scope.isAddFormOpen = false;
		$scope.dataToAdd = {};
		$scope.space = {};
		$scope.showAddNameForm = showAddNameForm;
		$scope.closeAddNameForm = closeAddNameForm;
		$scope.addName = addName;
		$scope.vote = vote;

		$scope.showSuggestion = showSuggestion;
		$scope.isSuggestionOpen = false;
		$scope.suggestionLabel = 'Do you want some Suggestion ? Click here !!';

		function showSuggestion () {

			$scope.isSuggestionOpen = !$scope.isSuggestionOpen;
			$scope.suggestionLabel = $scope.isSuggestionOpen ? 'Hide Suggestion' : 'Do you want some Suggestion ? Click here !!';
			_scrollTo('allNamesList');
			getNamesForLetter('A');			
		}

		function closeAddNameForm () {

			$scope.isAddFormOpen = false;
			_scrollTo('viewSpaceNames');				
		
		}

		function showAddNameForm () {
		
			$scope.isAddFormOpen = true;
			_scrollTo('addNameForm');		

		};

		function _scrollTo (id) {

			$timeout(function() {
				$anchorScroll(id);
				$scope.$apply();
			}, 100);

		}

		function _resetForm () {
			$scope.dataToAdd.babyname = "";
			$scope.dataToAdd.email = "";
			$scope.dataToAdd.meaning = "";
			$scope.dataToAdd.gender = "";
			$scope.dataToAdd.addedBy = "";
		}

		function vote (name) {
			console.log('controller add name');

			name.likes ++ ;
			name.id = _spaceId;
				
			SpaceNamesService.vote(name)
			.then(function(response) {
				//No need to do anythig as we have already updated view
			}, function(error) {
				//need to send error message
				name.likes -- ;
				alert('Server error');
			});
		}

		function addName () {
			console.log('getnamesfromspace controller add name :'+$scope.dataToAdd.gender);
			
		    //check if name alreday exists.. 
			var isNameRepeated = _.some($scope.namesList, function(name) {			
				return $scope.dataToAdd.babyname === name.babyname;
			});
			//console.log('validate :'+validate);
			//if exists show alert message
			if (isNameRepeated) {			  
			   alert('Name already present. Please like the name or add a new name'); 
			   $scope.dataToAdd.babyname = "";
			   return false;
			}

			//spacename and spaceid not avialable so hardcoded
			$scope.dataToAdd.spacename = $scope.space.spacename;
			$scope.dataToAdd.spaceid = _spaceId;
			SpaceNamesService.addName($scope.dataToAdd)
			.then(function(response) {
				if(response.data.status === 'OK')
				//close the form
				closeAddNameForm();
				//show toast notification // can be improved as footer background is also same
				//snackbarContainer.MaterialSnackbar.showSnackbar({message: "Name Added Successfully"});
				//reset form values
				_resetForm();
				//refresh names list
				_getNames();

			}, function(error) {
				//handle error scenario
			});
		};
	

		function _getNames () {

			$scope.tabs = [];
		
			SpaceNamesService.getNamesForSpace({'spaceid': _spaceId})
			.then(function(response) {	

				console.log('get nmes success controller :'+response.data.nameList);
				$scope.namesList = response.data.nameList;
				if($scope.namesList.length) {
					var tabName = '';
					if($scope.space.expectingNameFor === 'na') {
						tabName = 'either'
					}
					$scope.tabs = TabsFactory.setTabsView(response.data.nameList, tabName);
					console.log('in if'+JSON.stringify($scope.tabs));
				}
				console.log('out of if');
				$timeout(function() {
		            componentHandler.upgradeAllRegistered();
		        })	
				
				
			}, function(error) {

			});

		}

		function _getSpaceDetails () {
			console.log('spaceId :'+_spaceId);
			SpaceService.getSpaceDetails({'spaceid': _spaceId})
			.then(function(response) {	

				console.log('get sapce details success : '+JSON.stringify(response.data.spaceInfo));
				$scope.space = response.data.spaceInfo;

				_getNames()
				
			}, function(error) {

				console.log('get space details error')

			});
		}

		function _init () {
			_getSpaceDetails();

		};

		_init();	




//All names logic start
		$scope.alphabets = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

		$scope.getNamesForLetter = getNamesForLetter;

		function getNamesForLetter (letter) {
			NamesService.getNamesForLetter(letter)
				.then(function (success) {
					$scope.allNamesList = success.data.nameList;			
					$timeout(function() {
		            	componentHandler.upgradeAllRegistered();
		        	})
				}, function (error) {

				})
		}


	/*	function _filterNamesList (data, gender) {
			return _.filter(data , function (name) {
				return name.gender === gender;
			});
		}*/
//All names logic end
	};

	GetNamesFromSpaceController.$inject = ['$scope', 'lodash', '$routeParams', '$timeout', '$window', '$document', '$anchorScroll',
										'SpaceService', 'SpaceNamesService', 'NamesService', 'TabsFactory'];

})()
