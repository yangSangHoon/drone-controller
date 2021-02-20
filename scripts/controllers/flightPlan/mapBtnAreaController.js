kindFramework.controller('mapBtnAreaController', function( $scope, ModalService, BroadcastAPI, MapService, SockManagerService, DroneModel, PopupManager ){
	

	$scope.download = function(){
		downloadMission();
	};

	function downloadMission(){
		PopupManager.showProgress();
		var sendData = {
			mode : "getMission",
			frame : 0
		};
		SockManagerService.send( sendData );
	}
	
	
	$scope.loadWaypoint = function(){
		ModalService.showPopup({
			templateUrl: 'views/popup/load_waypoint.html',
			controller: 'loadWaypointController',
			position: {left:'auto', right:'160px', top:'135px'},
			id : 'loadWayPointPop'
		});
	};
	
	$scope.saveWaypoint = function(){
		
		saveWaypointPop = ModalService.showPopup({
			templateUrl: 'views/popup/save_waypoint.html',
			controller: 'saveWaypointController',
			position: {left:'auto', right:'10px', top:'135px'},
			id : 'saveWayPointPop'
		});
		
	};


	downloadMission();
	
});