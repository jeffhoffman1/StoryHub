var stickyApp = angular.module('stickyApp', []);
 
stickyApp.controller("EditorController", ["$scope", function ($scope) {
	$scope.user = {};
	$scope.user.name = "Captain Awesome";
	$scope.revisions = {};
	$scope.currentRevisionTree = {};
	$scope.currentRevisionTree.revisions = [];
	$scope.selected = {};
	$scope.editMode = false;
	$scope.mode = "add";
	$scope.newText = "";
	$scope.added = [];
	$scope.deleted = [];
	$scope.edited = [];
	$scope.selectedIndex = -1;
	
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
	
	$scope.saveEdits = function() {
		$http.put(added);
		$http.post(edited);
		$http.delete(deleted);
		$scope.editMode = false;
	}
	
	$scope.setSelected = function($index) {
		$scope.selected.selected = false;
		$scope.currentRevisionTree.revisions[$index].selected = true;
		$scope.selected = $scope.currentRevisionTree.revisions[$index];
		$scope.selectedIndex = $index;
		if ($scope.mode == "edit") {
			$scope.newText += $scope.currentRevisionTree.revisions[$index].text;
		}
	}
	
	$scope.applyChanges = function() {
		if ($scope.mode == "delete") {
			var paragraph = {userID: $scope.user.id, revisionTreeID: $scope.currentRevisionTree.id, revisionID: $scope.currentRevisionTree.revisions[$scope.selectedIndex].id};
			$scope.deleted.push(paragraph);
			$scope.currentRevisionTree.revisions.splice($scope.selectedIndex, 1);
		} else {
			var paragraph = {text: $scope.newText, userID: $scope.user.id, revisionTreeID: $scope.currentRevisionTree.id, insertionIndex: $scope.selectedIndex};
			$scope.newText = "";
			if ($scope.mode == "add") {
				$scope.added.push(paragraph);
				$scope.currentRevisionTree.revisions.splice($scope.selectedIndex + 1, 0, paragraph);
				$scope.setSelected($scope.selectedIndex + 1);
			} else if ($scope.mode == "edit") {
				paragraph.revisionID = $scope.currentRevisionTree.revisions[$scope.selectedIndex].id;
				$scope.edited.push(paragraph);
				$scope.currentRevisionTree.revisions[$scope.selectedIndex].text = paragraph.text;
			} 
		}
	}
}]);
