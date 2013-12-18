var stickyApp = angular.module('stickyApp', []);
 
stickyApp.controller("EditorController", ["$scope", "$http", function ($scope,$http) {
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
	$http.get("/user").success(function(data, status, headers, config) {
		$scope.user = data;
	});
	$http.get("/revisions").success(function(data, status, headers, config) {
		$scope.revisions = data;
		console.log("data",data);
		for(d in data){
			var paragraph = {"text" : data[d].Text};
			console.log(paragraph);
			$scope.added.push(paragraph);
			$scope.currentRevisionTree.revisions.splice($scope.selectedIndex + 1, 0, paragraph);
			$scope.setSelected($scope.selectedIndex + 1);
		}
	});
	$http.get("/revisionTree").success(function(data, status, headers, config) {
		$scope.currentRevisionTree = data;
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
			var revision = {text:$scope.newText,userID: $scope.user.id, revisionBranchID:$scope.currentRevisionTree.id, type:"paragraph"}
			$scope.newText = "";
			if ($scope.mode == "add") {
				$scope.added.push(paragraph);
				$scope.currentRevisionTree.revisions.splice($scope.selectedIndex + 1, 0, paragraph);
				$scope.setSelected($scope.selectedIndex + 1);
			} else if ($scope.mode == "edit") {
				paragraph.revisionID = $scope.currentRevisionTree.revisions[$scope.selectedIndex].id;
				revision.revisionID = paragraph.revisionID;
				$scope.edited.push(paragraph);
				$scope.currentRevisionTree.revisions[$scope.selectedIndex].text = paragraph.text;
			} 
			$http.post("/revision",{obj:revision});
		}
	}
	
	$scope.upvote = function() {
		$scope.selected.upvotes++;
		$http.post("/upvote", {revisionID: $scope.selected.revisionID, userID: $scope.user.id});
	}
	
	$scope.downvote = function() {
		$scope.selected.downvotes++;
		$http.post("/downvote", {revisionID: $scope.selected.revisionID, userID: $scope.user.id});
	}
}]);
