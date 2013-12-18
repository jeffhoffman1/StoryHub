'use strict';

/* Controllers */

var StickyBooksControllers = angular.module('StickyBooksControllers', []);



StickyBooksControllers.controller('MainCtrl', ['$scope', 'Book',
  function($scope, Book) {
    $scope.genres = Book.query();
    
  }]);

StickyBooksControllers.controller('bookDetailCtrl', ['$scope', '$routeParams', 'Book',
  function($scope, $routeParams,Book, $window) {
		$scope.book = Book.get({bookId: $routeParams.bookId}, function(book) {
		$scope.mainImageUrl = book.imageUrl;
		
	});
	$scope.rating = 4; // How do I get this from the database?
	
	$scope.saveRatingToServer = function(rating) {
		//$window.alert('Rating selected - ' + rating);
	};
	
	$scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }
  }]);
  
  StickyBooksControllers.directive('starRating', function () {
    return {
			restrict: 'A',
			template: '<ul class="rating">' +
					  '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
					  '\u2605' +
					  '</li>' +
					  '</ul>',
			scope: {
					ratingValue: '=',
					max: '=',        
					readonly: '@',       
					onRatingSelected: '&'      
			},     
			link: function (scope, elem, attrs) {        
					var updateStars = function() {          
						scope.stars = [];          
						for (var  i = 0; i < scope.max; i++) {            
							scope.stars.push({filled: i < scope.ratingValue});          
						}        
					};        
		
					scope.toggle = function(index) {          
						if (scope.readonly && scope.readonly === 'true') {           
							return;          
						}          
						scope.ratingValue = index + 1;  
						scope.onRatingSelected({rating: index + 1});        
					};        
					scope.$watch('ratingValue', function(oldVal, newVal) {          
						if (newVal) {            
							updateStars();          
						}        
					});      
			}    
			}  
		});

