kindFramework.controller("currentStateController", function( $scope, $rootScope, $filter, BroadcastAPI, DroneModel ){
	
	$scope.$on( BroadcastAPI.MODE_CHANGE, function(){
		textCheck();
	});
	
	function textCheck(){
		var txt = "";
		if( DroneModel.saveCustumMode == DroneModel.currentMode.STABILIZE ){
			txt = $filter('translate')('MANUALLY_FLY');
		}else if( DroneModel.saveCustumMode == DroneModel.currentMode.AUTO ){
			txt = $filter('translate')('AUTO_FLY');
		}
		$scope.text = txt;
	}

	textCheck();

	
});