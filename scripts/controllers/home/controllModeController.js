kindFramework.controller('controllModeController', function( $scope, SendProtocol, $filter, BroadcastAPI, DroneModel ){

	var modeList = [$filter('translate')('MANUALLY_FLY'), $filter('translate')('AUTO_FLY')];
	var index = 0;
	
	function modeChange(){
		//$scope.btn = modeList[index];
		
		if( index === 0 ){
			DroneModel.setCustumMode(2);//test
			SendProtocol.setAuto();
		}else{
			DroneModel.setCustumMode(4);//test
			SendProtocol.setManually();
		}
	}
	
	$scope.modeChange = function(){

		if( index < modeList.length - 1  ){
			index++;
		}else{
			index = 0;
		}
		modeChange();
	};

	$scope.$on( BroadcastAPI.MODE_CHANGE, function( e, mode ){
		setBtnMode( mode );
	});

	function setBtnMode(mode){
		if( mode == DroneModel.currentMode.AUTO ){ //auto
			index = 0;
		}else{
			index = 1;
		}
		$scope.btn = modeList[index];
	}
	setBtnMode( DroneModel.saveCustumMode );

});