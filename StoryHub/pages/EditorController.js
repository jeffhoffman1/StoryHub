var stickyApp = angular.module('stickyApp', []);
 
stickyApp.controller('EditorController', function ($scope) {
	$scope.user = {};
	$scope.user.name = "Captain Awesome";
	$scope.revisions = {};
	$scope.currentRevisionTree = {};
	$scope.editMode = false;
	
	//Load the data needed for the editor page
	$scope.$apply(function() {
		$http.get("/user").success(function(data, status, headers, config) {
			$scope.user = data;
		});
		$http.get("/revisions").success(function(data, status, headers, config) {
			$scope.revisions = data;
		});
		$http.get("/revisionTree").success(function(data, status, headers, config) {
			$scope.currentRevisionTree = data;
		});
	});
});
