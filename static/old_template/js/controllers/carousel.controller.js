(function () {
'use strict'

angular.module('suggest')
	.controller('CarouselController', function () {

		var vm = this;
		var slides = vm.slides = [];	

		slides.push({image: 'images/slide_01.jpg',id: 0},{image: 'images/slide_02.jpg',id: 1});

		vm.myInterval = 5000;
 		vm.noWrapSlides = false;
  		vm.active = 0;

	});
	
}());