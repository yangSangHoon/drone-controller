kindFramework.controller('dataBoardController', function($rootScope, $scope, BroadcastAPI){
	$scope.state = "";
	$scope.time = "00:00:00";
	var _scope = $scope;
	$scope.$on( BroadcastAPI.DRONT_STATUS, function(scope, data){
		_scope.state = data.status;
		_scope.$apply();
	});
	
});