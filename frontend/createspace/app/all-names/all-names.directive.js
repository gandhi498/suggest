'use strict';

require('./all-names.module')
    .directive('csAllNames', csAllNames);

function csAllNames() {

    return {
        restrict: 'EA',
        templateUrl: 'all-names/cs-all-names.html',
        replace: true,
        controller: Controller,
        controllerAs: 'allNames'
    };

    /* @ngInject */
    function Controller(
        $state,
        csApiMySpace,
        $rootScope,
        $timeout
    ) {

        var vm = this;

        vm.model = {};
        vm.model.alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        vm.model.namesList = [];
        vm.getNamesForLetter = getNamesForLetter;

        function getNamesForLetter(letter) {
            csApiMySpace.getNamesForLetter(letter)
                .then(function (success) {
                    vm.model.namesList = success.data.nameList;
                    $timeout(function () {
                        componentHandler.upgradeAllRegistered();
                    })
                }, function (error) {
                    console.log("Error occurred while getting names by letter: %s",JSON.stringify(error));
                })
        }


    }
}