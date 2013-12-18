'use strict';

/* App Module */

var StickyBooksApp = angular.module('StickyBooksApp', [
  'ngRoute',
  'StickyBooksControllers',
  'bookFilters',
  'bookServices'
]);

StickyBooksApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/mainpage.html',
        controller: 'MainCtrl'
      }).
      when('/books/:bookId', {
        templateUrl: 'partials/book-detail.html',
        controller: 'bookDetailCtrl'
      }).
	  when('/signin', {
        templateUrl: 'partials/signin.html',
     }).
      
	  otherwise({
        redirectTo: '/'
      });
  }]);
  






