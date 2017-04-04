(function () {
	'use strict'

	angular.module('newbie')
		.factory('TabsFactory', TabsFactory)

		function TabsFactory (_) {

			//private variables
			var _tabs = [];
			//var _tabNames = ['boy', 'girl'];
			var _filterNamesList = _filterNamesList; 

			var factory = {};

			factory.setTabsView = setTabsView

			return factory;

			function _filterNamesList (list, gender) {
				return _.filter(list , function (name) {
					return name.gender === gender;
				});
			}

			function setTabsView (namesList, filter) {
				_tabs = [];			

				_tabs.push({name: filter, list: namesList});

				if (filter === 'either') {
					//show other tabs too
					_.forEach(['boy', 'girl'], function(type) {
						(function() {
							_tabs.push({name: type, list: _filterNamesList(namesList, type)} );
						})()
					})

				} 

				console.log(_tabs);
				return _tabs;

			}

		}

		TabsFactory.$inject = ['lodash'];
})();