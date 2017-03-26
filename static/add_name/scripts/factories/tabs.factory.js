(function () {
	'use strict'

	angular.module('newbie')
		.factory('TabsFactory', TabsFactory)

		function TabsFactory (_) {

			//private variables
			var _tabs = [];
			var _tabNames = ['Boy', 'Girl'];
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

				console.log('set tabs view');
				console.log('set tabs view data '+JSON.stringify(tabData));
				console.log('set tabs view data '+tabName);

				_tabs.push({name: tabName, list: tabData});

				if (tabName === 'Either') {

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