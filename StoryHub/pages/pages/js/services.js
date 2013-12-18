'use strict';

/* Services */

var bookServices = angular.module('bookServices', ['ngResource']);

bookServices.factory('Book', ['$resource',
  function($resource){
    return $resource('books/:bookId.json', {}, {
      query: {method:'GET', params:{bookId:'books'}, isArray:true}
    });
  }]);
