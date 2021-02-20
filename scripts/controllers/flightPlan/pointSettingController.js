kindFramework.controller('pointSettingController', function($scope, $element, close) {
		
	$scope.closeModal = function() {
		
		close(null, 500);
	};
	
	$scope.save = function() {
		var obj = {
			speed : $scope.speed,
			height : $scope.height,
			time : $scope.time,
			state : $scope.state
		};
		close(obj, 500);
	};
	
	this.setData = function(obj){
		$scope.speed = obj.speed;
		$scope.height = obj.height;
		$scope.time = obj.time;
		$scope.state = obj.state;
	};


	$scope.deleteMarker = function(){
		var obj = { isDelete: true };
		close(obj, 500);
	};

});