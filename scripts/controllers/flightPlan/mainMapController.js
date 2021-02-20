kindFramework.controller('mainMapController', function( $rootScope, $scope, $element, $filter, PopupManager, SendDataService, SendProtocol, RestClient, MapService, BroadcastAPI, ViewSwapService, MapManager, DroneInMap, DroneModel, SockManagerService ){

	
	var isFirst = true;
	var map = null;
	
	////////bottom total Point area //////////////////////////////////////

	var savePointList;
	function updateWayPoint(dataObj){
		for( var i = 0; i<$scope.datas.length; i++ ){
			if( $scope.datas[i].index == dataObj.index ){
				$scope.datas[i].altitude = Number( dataObj.height ).toFixed(2);
				$scope.datas[i].speed = dataObj.speed;
			}
		}
		$scope.$apply();
	}

	function drawTotalWay(total_length, pointList){

		savePointList = pointList;

   		$scope.datas = [];

   		var maxWidth = (window.innerWidth > 0)? window.innerWidth : screen.width;

		for (var i = 0; i < pointList.length; i++) {
			var dist = pointList[i].dist;
			var waypoint={};
			waypoint.arrignDist = dist/total_length*100;
			//console.log( 'waypoint.arrignDist : ' + waypoint.arrignDist );
			waypoint.index = pointList[i].index;
			if( i == 0 ){
			    waypoint.number = "s";    
			}else{
                    waypoint.number = i;
			}
			if( pointList[i].dataObj.height === null ) pointList[i].dataObj.height = 0;
			waypoint.altitude =  Number(pointList[i].dataObj.height).toFixed(2);//input data from manual panel
			waypoint.speed = pointList[i].dataObj.speed;//input data from manual panel
			$scope.datas.push(waypoint);
		}
		$scope.totalLength = pointList.length - 1;
		var totalWidth = $element.find("#bollContainer").width();
		var lastWidth = 47;
		var lastItem = $element.find("#waypoint_bar .last");
		if( lastItem.length > 0 ) lastWidth = lastItem.width();
		$scope.wayLineWidth = totalWidth - lastWidth;

		if($scope.$$phase != '$apply' && $scope.$$phase != '$digest') {
			$scope.$apply();
		}
     }

	//////////////////////////////////////////////////////////////
	
	MapManager.init({
		url : "http://127.0.0.1:3303",
	});

	$element.find('#mapArea').empty();

	$element.height( $(window).height() );
	var isOnline = false;
	if( typeof google !== "undefined"){	//인터넷이 되는 상황
		console.log('online');
		map = MapService;
		mapInitData = {
			container : $element.find('#mapArea'),
			drone : $element.find('#drone'),
			gap : 0,
			isHome : false
		};
		isOnline = true;
	}else{
		console.log('offline');
		map = new DroneInMap();
		mapInitData = {
			container : $element.find('#mapArea'),
			isHome : false,
			gap : 0,
		};
		
	}
	$scope.isOnline = isOnline;
	
	map.init( mapInitData );
	map.setFunc( {drawTotalWay : drawTotalWay, updateWayPoint : updateWayPoint });

	//gpsSetting();

	$scope.imgCheck = function(index){
		console.log( index );
	};
	
	function missionUpload(){
		var wayPointData = map.getWayPointData();
		if( wayPointData.items !== null && wayPointData.items.length > 1 ){
			DroneModel.setMissionNum(wayPointData.items.length);
			PopupManager.showProgress();
			SockManagerService.send(wayPointData);
			//window.setMissionItem = wayPointData.items;
			localStorage.setItem('wayPointData', JSON.stringify( wayPointData.items ) );
		}else{
			PopupManager.toast( $filter('translate')('DO_ADD_MISSION') );
		}
	}
	
	var isModifyCheck = false;
	$scope.onClickPlan = function() {
		if(isModifyCheck === false){
			setEditTrue();
		}else{
			PopupManager.confirm( $filter('translate')('UPLOAD_CURRENT_MISSION'), function( result ){
				if( result === true ){
					missionUpload();
				}
			});
		}
	};


	$scope.$on( BroadcastAPI.MISSION_UPLOAD_COMPLETE, function(){
		PopupManager.hideProgress();
		PopupManager.toast( $filter('translate')('UPLOAD_COMPLETE') );
		setEditFalse();
	});

	function setEditTrue(){
		if( isModifyCheck === false ){
			isModifyCheck = true;
			$scope.editClass="complete";
			map.removeClickListener();
			map.setClickListener();
			PopupManager.toast( $filter('translate')('CHANGED_MANUALMODE') );	
		}
	}

	function setEditFalse(){
		isModifyCheck = false;
		$scope.editClass="";
		map.removeClickListener();
	}

	var missionLength = 0;
	var missionIndex = 0;
	var missionItems = [];
	//서버로 부터 미션을 받음
	$scope.$on( BroadcastAPI.GET_MISSION_ITEM, function(event, args){

		if( args.count <1 ){
			PopupManager.toast( $filter('translate')('NOT_SAVED_MISSION') );
			PopupManager.hideProgress();
			setEditTrue();
			return;
		}

		if( args.messageID == 44 ){
			missionItems = [];
			missionIndex = 0;
			missionLength = args.count;
			DroneModel.setMissionLength( missionLength );
		}else if( args.messageID == 39 ){
			missionIndex++;
			missionItems.push( args );
		}
		
		console.log( 'missionIndex : ' + missionIndex );
		console.log( 'missionLength : ' + missionLength );
		if( missionIndex == missionLength ){
			PopupManager.hideProgress();
			PopupManager.toast( $filter('translate')('DOWNLOAD_COMPLETE') );
			//missionItems.pop();
			map.setWayPointData( missionItems, true );
			setEditFalse();
			//window.setMissionItem = missionItems;
			localStorage.setItem('wayPointData', JSON.stringify( missionItems ) );
			
		}
	});

	$scope.$on( BroadcastAPI.DRAW_SAVED_WAYPOINT, function(event, missionItems ){
		setTimeout( function(){
			map.setWayPointData( missionItems, true );
			setEditFalse();
		}, 1000 );
	});

	$scope.$on( BroadcastAPI.POINT_DATA_SETTING, function(){
		map.removeClickListener();
	});
	
	//픽셀좌표 받기
	$scope.$on( BroadcastAPI.SET_MARK_BY_PIXEL, function(event, args){
		map.setMarkByPixel( args );
	});

	//카메라 뷰 생성
	$scope.$on( BroadcastAPI.SET_CAMERA_VIEW_AREA, function(event, args){
		map.makeCameraArea( args );
	});

	//카메라뷰 버튼 클릭시
	$scope.$on( BroadcastAPI.MAKE_CAMERA_POINT, function(){
		map.makeCameraPoint();
	});

	//미션 모두지우기
	$scope.$on( BroadcastAPI.REMOVE_ALL_MISSION, function(){
		/*var currentLatLng = [37.40315614803248, 127.11047530174255 ];
		map.setDronePosition(currentLatLng);
		$scope.moveDist = map.getMoveDroneRate( 1, currentLatLng );*/

		clearMarkers();
		setEditTrue();
	});

	$scope.$on( BroadcastAPI.DRONE_DIRECTION, function(e, value){
		map.setDroneHeadRotate( value * 0.01 );
	});

	//수정모드
	/*$scope.$on( BroadcastAPI.MAP_EDIT_MODE, function(event, args){
		map.redrawPointPoliyLine();
		if(isModifyCheck == false){
			isModifyCheck = true;
			map.setClickListener();
		}
		else{
			isModifyCheck = false;
			map.removeClickListener();
		}
		//map.setClickListener();
	});
	*/

	/**
	*	off라인 맵 구현을 위한 현 지도 좌표중심으로 지도를 저장
	*/
	function saveMapData(){

		var center = map.getCenter();
		var zoom = map.getZoom();
		
		PopupManager.showProgress();
		MapManager.saveMap({
			currentLatLng : { lat : center.lat(), lng : center.lng() },	//현재 보고있는 지도 좌표
			possibleDistance : 0.1,	//이동가능거리 20km
			zoom : zoom,
			success: function(){
				PopupManager.hideProgress();
				PopupManager.toast( $filter('translate')('SAVED_COMPLETE') );
			},
			error : function(){
				PopupManager.toast( $filter('translate')('INTERNET_FAILURE') );
			}
		});
		
	}
	
	//맵저장버튼 클릭시
	$scope.$on( BroadcastAPI.SAVE_MAP, function(){
		saveMapData();
	});

	//저장버튼 클릭시 로컬스토리지에 저장
	$rootScope.$on( BroadcastAPI.SAVE_WAYPOINT, function(){
		/*var wayPointData = map.getWayPointData();
		var data = JSON.stringify( wayPointData.items );
		localStorage.setItem('wayPointData', data );*/
	});

	//로드버튼 클릭시 로컬에 저장되어있는 way point좌표 표시
	$rootScope.$on( BroadcastAPI.LOAD_WAYPOINT, function(args, selectedWayPointValue){
		map.loadPointPoliyLine(selectedWayPointValue);
		setEditTrue();
		//DroneInMap.drawWaypoint(selectedWayPointValue);
	});

	//gps받기
	$scope.$on( BroadcastAPI.SET_MAP_LATLNG, function(){
		gpsSetting();
	});

	/**
	* 드론의 gps정보를 받아서 지도의 중심좌표과 드론의 위치를 바꿔준다
	*/
	
	function gpsSetting(){
		var lat = DroneModel.lat;
		var lon = DroneModel.lon;
		if( lat === 0 ){
			lat = 37.403928;
			lon = 127.109649;
		}
		var currentLatLng = [ lat, lon ];
		if( typeof google !== "undefined" ){	//인터넷이 되는 상황
			if( isFirst === true ){
				isFirst = false;
				//map.setWayPointData([{x : lat, y : lon }]);
				map.setDrone();
				map.changeLatLng( currentLatLng );
			}
			//map.setDronePosition(currentLatLng);
		}
		var moveDist = map.getMoveDroneRate( DroneModel.currentMissionNum, currentLatLng );
		$scope.moveDist = ( moveDist > 100 ) ? 100 : moveDist;
		map.setDronePosition(currentLatLng);
	}
	
	//gps받기
	$scope.$on( BroadcastAPI.SET_MAP_LATLNG, function(){
		gpsSetting();
	});
	

	/**
	* 픽셀정보로 지도좌표 표시
	*/
	$scope.makeMark = function(){

		var currentLatLng = [ 37.403928,127.109649 ];
		map.setDronePosition( currentLatLng );

		/*MapManager.saveMap({
			currentLatLng : { lat : 37.403928, lng : 127.109649 },	//현재 보고있는 지도 좌표
			possibleDistance : $scope.tx,	//이동가능거리 km
			zoom : $scope.ty
		});*/

		/*var pos = {
			x : $scope.tx,
			y : $scope.ty
		}
		map.setMarkByPixel( pos );*/
	};

	$scope.modifyWayPoint = function( index ){
		map.totalClickPoint( index - 1 );
	};

	function clearMarkers(){
		map.clearMarker();
		$scope.datas = [];
	}

	//////////////////btn이벤트//////////////////////////////

	$scope.clearAll = function(){
		clearMarkers();
	};


	//////////////////////////////////////////////////////////////////
	function startMission(){

		SendProtocol.setManually();
		SendProtocol.startEngine();
		if( SendProtocol.saveBaseMode == DroneModel.baseMode.ENGINE_START ){
			SendProtocol.startMission();
		}else{
			$scope.$on( BroadcastAPI.ENGIN_STATE, function(){
				SendProtocol.startMission();
			});	
		}
		SendProtocol.startMission();

		/*SendProtocol.startMissionEndless( DroneModel.missionNum);	
		DroneModel.missionStart();
		DroneModel.saveCurrentMissionMode = DroneModel.missionMode.START;*/
	}
	
	function currentMissionStateCheck( state ){
		if( state  == DroneModel.missionMode.START ){
			setStartedMission()
		}else if( state  == DroneModel.missionMode.END ){
			setEndMission();
		}
	}

	function setStartedMission(){
		$("#missionStart").hide();
		$("#missionStop").show();
		//var tarLeft = $(".command_btn_area").width() * -1;
		var tarLeft = 221 * -1;
		$(".command_btn_area").stop().animate({ left : tarLeft });
		$(".btn_edit ").hide();
		if( map.removeMoveLine != null ) map.removeMoveLine();
	}

	function setEndMission(){
		$("#missionStart").show();
		$("#missionStop").hide();
		$(".command_btn_area").stop().animate({ left : 0 });
		$(".btn_edit ").show();
	}
	
	$scope.startMission = function(){
		if( isModifyCheck === true ){
			PopupManager.confirm( $filter('translate')('DO_NOT_UPLOAD_START'),
				function(result){
					if( result === true ){
						startMission();
					}
				});
		}else{
			startMission();
		}
	};

	currentMissionStateCheck( DroneModel.saveCurrentMissionMode );
	$scope.$on( BroadcastAPI.MISSION_STATE, function( e, state ){
		currentMissionStateCheck( state );
	});

	$scope.$on( BroadcastAPI.MISSION_START, function(){
		if( map.removeMoveLine !== null ) map.removeMoveLine();
	});

	$scope.stopMission = function(){
		$("#missionStart").show();
		$("#missionStop").hide();
		SendProtocol.land();
		//SendProtocol.returnToLaunch();
	};

	$scope.goHome = function(){
		SendProtocol.returnToLaunch();
	};

	var txtHovering = $filter('translate')('HOVERING');
	var txtResume = $filter('translate')('RESUME');
	$scope.hovering = txtHovering;
	$scope.goHovering = function(){
		if( $scope.hovering === txtHovering ){
			$scope.hovering = txtResume;
			SendProtocol.hovering();
		}else{
			$scope.hovering = txtHovering;
			SendProtocol.resume();
		}
	};

	$scope.$on( BroadcastAPI.MISSION_END, function(){
		SendProtocol.returnToLaunch();
		setStartedMission();
	});

});
