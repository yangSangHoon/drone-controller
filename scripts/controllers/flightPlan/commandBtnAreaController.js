kindFramework.controller('commandBtnAreaController', function( $scope, $element, $filter, $rootScope, MapService, MapManager, SockManagerService, SendDataService, DroneModel, BroadcastAPI, PopupManager, GLOBAL ){

	var isOnline =false;
	if( typeof google !== "undefined" ){
		isOnline = true;
	}
	$scope.isOnline = isOnline;
	var missions = localStorage.getItem('wayPointData' );
	if( missions !== null && missions !== "undefined" && DroneModel.saveCurrentMissionMode == DroneModel.missionMode.START ){
		GLOBAL.currentMenu = "mission";
	}

	if( GLOBAL.currentMenu === "auto"){
		goAuto();
	}else{
		goMission();
	}

	$element.css({"maxHeight" : $(window).height() - 170 });
	$element.find('.btn_con').kindSideMenu();

	$scope.startEngine = function(){
		SendDataService.startEngine();
	};

	$scope.stopEngine = function(){
		SendDataService.stopEngine();
	};

	$scope.takeoff = function(){
		SendDataService.takeOff();
	};

	$scope.land = function(){
		SendDataService.land();
	};

	$scope.startMission = function(){
		SendDataService.startMission();
	};

	$scope.stopMission = function(){
		SendDataService.stopMission();
	};

	$scope.returnToLaunch = function(){
		SendDataService.returnToLaunch();
	};

	$scope.saveMap = function(){
		//test;
		/*PopupManager.showProgress();
		setTimeout( function(){
			PopupManager.hideProgress();
			PopupManager.toast('저장이 완료 되었습니다.');
		},3000 );*/

		$rootScope.$broadcast( BroadcastAPI.SAVE_MAP );
	};

	$scope.cameraPoint = function(){
		$rootScope.$broadcast( BroadcastAPI.MAKE_CAMERA_POINT );
	};

	$scope.clearAll = function(){
		PopupManager.confirm( $filter('translate')('MISSION_ALL_CLEAR'), function(result){
			if( result === true ){
				$rootScope.$broadcast( BroadcastAPI.REMOVE_ALL_MISSION );
			}
		});
	};

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
	
	var isShow = true;
	$scope.showHide = function(){
		isShow = isShow ? false : true;
		var tarRight = isShow ? '0px' : -$element.innerWidth()+'px';
		$element.stop().animate({ left : tarRight },300 );
	};

	$scope.editMode = function(){
		$rootScope.$broadcast( BroadcastAPI.MAP_EDIT_MODE );
	};

	function goAuto(){
		$scope.autoClass = "on";
		$scope.missionClass = "";
		if( isOnline === true ){
			MapService.changeToAuto();
			MapService.setClickListener();	
		}
		
		$("#mapEditBtn").hide();
		$("#waypoint_bar").hide();
		$(".mission_bottom_btns").hide();

		GLOBAL.currentMenu = "auto";
		$scope.isMission = false;
	}
	
	function goMission(){
		$scope.autoClass = "";
		$scope.missionClass = "on";

		if( isOnline === true ){
			MapService.changeToWaypoint();
			MapService.removeClickListener();

			var missions = localStorage.getItem('wayPointData' );
			if( missions === null || missions === "undefined" ){
				downloadMission();
			}else{
				//$rootScope.$broadcast( BroadcastAPI.MISSION_STATE, DroneModel.missionMode.START );
				$rootScope.$broadcast( BroadcastAPI.DRAW_SAVED_WAYPOINT, JSON.parse( missions ) );
			}
		}

		$("#mapEditBtn").show();
		$("#waypoint_bar").show();
		$(".mission_bottom_btns").show();
		
		GLOBAL.currentMenu = "mission";
		$scope.isMission = true;
	}
	
	$scope.goAuto = function(){
		goAuto();		
	};

	$scope.goMission = function(){
		goMission();		
	};

	

	
	//////////////////////////////////////////////////////

		
	$scope.setLoiter = function(){
		var data = {};
		$.extend( data, dataObj );
		data.command = 17;
		data.param5 = DroneModel.lat;
		data.param6 = DroneModel.lon;
		data.param7 = DroneModel.alt;

		if( isHome ){
			isHome = false;
			data.param3 = 1;

		}else{
			isHome = true;
			data.param3 = 0;

		}

		sendData( data );
	};
	

	
});