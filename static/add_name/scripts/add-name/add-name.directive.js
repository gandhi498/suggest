(function() {
	'use strict'

	angular.module('newbie')
		.directive('addName', addName)

		addName.$inject = ['lodash', '$routeParams', '$timeout', '$anchorScroll', 'SpaceService', 'SpaceNamesService', 'TabsFactory'];

		function addName(_, $routeParams, $timeout, $anchorScroll, SpaceService, SpaceNamesService, TabsFactory) {

			return {

				restrict: 'A',
				templateUrl: 'scripts/add-name/add-name.html',
				controller: addNameController,
				controllerAs: 'addName'

			}

			//addNameController.$inject = ['scope'];

			function addNameController() {

				console.log('add names controller');
				var vm = this;
				var _spaceId = $routeParams.spaceId;
				//console.log('space id : '+_spaceId);
				var _getSpaceDetails = _getSpaceDetails;
				var _getNames = _getNames;
				var _scrollTo = _scrollTo;

				vm.model = {};
				vm.model.spaceNames = {};
				vm.model.dataToAdd = {};
				vm.model.isAddFormOpen = false;
				vm.addName = addName;				
				vm.showAddNameForm = showAddNameForm;
				vm.closeAddNameForm = closeAddNameForm;
				vm.vote = vote;

				function _scrollTo (id) {

					$timeout(function() {
						$anchorScroll(id);
						//scope.$apply();
					}, 100);

				}

				function closeAddNameForm () {

					vm.isAddFormOpen = false;
					_scrollTo('viewSpaceNames');				
				
				}


				function showAddNameForm () {
				
					vm.isAddFormOpen = true;
					_scrollTo('addNameForm');		

				};

				function _resetForm () {
					vm.model.dataToAdd.babyname = "";
					vm.model.dataToAdd.email = "";
					vm.model.dataToAdd.meaning = "";
					vm.model.dataToAdd.gender = "";
					vm.model.dataToAdd.addedBy = "";
				};

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
					console.log('getnamesfromspace controller add name :'+vm.model.dataToAdd.gender);
					
				    //check if name alreday exists.. 
					var isNameRepeated = _.some(vm.model.spaceNamesList, function(name) {			
						return vm.model.dataToAdd.babyname === name.babyname;
					});
					//console.log('validate :'+validate);
					//if exists show alert message
					if (isNameRepeated) {			  
					   alert('Name already present. Please like the name or add a new name'); 
					   vm.model.dataToAdd.babyname = "";
					   return false;
					}

					//spacename and spaceid not avialable so hardcoded
					vm.model.dataToAdd.spacename = vm.model.space.spacename;
					vm.model.dataToAdd.spaceid = _spaceId;
					SpaceNamesService.addName(vm.model.dataToAdd)
					.then(function(response) {
						if(response.data.status === 'OK')
						//close the form
						vm.closeAddNameForm();
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

					vm.model.spaceNames.tabsView = [];
				
					SpaceNamesService.getNamesForSpace({'spaceid': _spaceId})
					.then(function(response) {	

						console.log('get nmes success controller :'+response.data.nameList);
						vm.model.spaceNamesList = response.data.nameList;
						if(vm.model.spaceNamesList.length) {	
											
							var filter = vm.model.space.spaceDetails.expectingNameFor === 'na' ? 'either' : vm.model.space.spaceDetails.expectingNameFor;
							vm.model.spaceNames.tabsView = TabsFactory.setTabsView(vm.model.spaceNamesList, filter);
							
						}
						
						$timeout(function() {
				            componentHandler.upgradeAllRegistered();
				        })	
						
						
					}, function(error) {

					});

				};
				
				function _getSpaceDetails() {

					SpaceService.getSpaceDetails({'spaceid': _spaceId})
					.then(function(response) {	

						console.log('get sapce details success : '+JSON.stringify(response.data.spaceInfo));
						vm.model.space = response.data.spaceInfo;

						_getNames()
						
					}, function(error) {

						console.log('get space details error')

					});

				};

				_getSpaceDetails(); //get space details on start up
				
			}

		}

})();