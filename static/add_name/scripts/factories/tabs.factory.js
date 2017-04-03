(function () {
	'use strict'

	angular.module('newbie')
		.factory('TabsFactory', TabsFactory)

		function TabsFactory (_) {

			//private variables
			var _tabs = [];
			var _tabNames = ['boy', 'girl'];
			var _filterNamesList = _filterNamesList; 

			var factory = {};

			factory.setTabsView = setTabsView

			return factory;

			function _filterNamesList (data, gender) {
				return _.filter(data , function (name) {
					return name.gender === gender;
				});
			}

			function setTabsView (tabData, tabName) {
				_tabs = [];			

				_tabs.push({name: tabName, list: tabData});

				if (tabName === 'either') {
					//show other tabs too
					_.forEach(_tabNames, function(tab) {
						(function() {
							_tabs.push({name: tab, list: _filterNamesList(tabData, tab)} );
						})()
					})

				} 

				console.log(_tabs);
				return _tabs;

			}

		}

		TabsFactory.$inject = ['lodash'];
})();