kindFramework.controller('cameraViewMapController', function( $rootScope, $scope, $element, DroneModel, MapService, DroneInMap, ViewSwapService, BroadcastAPI ){
	
	//if( !$.isMobile() ) MapService.init( $element.find('div')[0] );
	var latLngList = null;
	var first = true;
	var latLng = localStorage.getItem('wayPointData' );
	//var latLng = window.setMissionItem;
	if( latLng === null || latLng === "undefined"){
		latLngList = [];
	}else{
		latLngList = JSON.parse(latLng);	
	//	latLngList = JSON.parse(latLng);	
	} 
	var mapService = MapService;
	if( typeof google !== "undefined"){	//인터넷이 되는 상황
		mapService.init({
			container : $element.find('#dmContainer'),
			drone : $element.find('#homeDrone'),
			uavImg : 'images/icons/ico_uav_small.png',
			iconImg : 'images/icons/ico_waypoint_small.png',
			iconOnImg : 'images/icons/ico_waypoint_small.png',
			isHome : true
		});
		mapService.changeToWaypoint();
		mapService.changeZoom(16);
		mapService.offDrag();
		mapService.offZoom();
		mapService.removeClickListener();
	}else{	//인터넷 안되서 저장된 맵 불러오는 로직
		mapService = new DroneInMap();
		mapService.init({
			container : $element.find('#dmContainer'),
			latLngList : latLngList,
			types : true
		});
	}

	//gpsSetting();

	$scope.changeLatLng = function( latLng ){
		mapService.changeLatLng( latLng );
	};

	$scope.changeHead = function( head ){
		mapService.changeHead( head );
	};

	$scope.$on( BroadcastAPI.MISSION_START, function(){
		if( mapService.removeMoveLine !== null ) mapService.removeMoveLine();
	});
	
	function gpsSetting(){
		var lat = DroneModel.lat;
		var lon = DroneModel.lon;
		if( lat === 0 ){
			lat = 37.403928;
			lon = 127.109649;
		}
		var currentLatLng = [ lat, lon ];
		//
		if( first === true ){
			first = false;
			if( mapService.setDrone !== null ) mapService.setDrone();
			setTimeout( function(){
				mapService.setWayPointData( latLngList );	
			}, 1000 );
			
		}
		//mapService.setDrone();
		mapService.setDronePosition( currentLatLng );
		mapService.changeLatLng( currentLatLng );
	}

	$scope.$on( BroadcastAPI.SET_MAP_LATLNG, function(){
		gpsSetting();
	});

	


	//////////////////////////////////////
	var changeViewClickTimer = null;
	$scope.changeView = function(){
        //모바일 투터치 버그 관련
          if( changeViewClickTimer !== null ) clearTimeout( changeViewClickTimer );
          changeViewClickTimer = setTimeout( function(){
               ViewSwapService.changeView($element);
			mapService.reSetting();
            changeViewClickTimer = null;
          },300);
		
	};

	$scope.$on( BroadcastAPI.SET_MAP_RESET, function(){
		mapService.reSetting();
	});

	$scope.$on( BroadcastAPI.DRONE_DIRECTION, function(e, value){
		mapService.setDroneHeadRotate( value * 0.01 );
	});

	//test	/////////////////////////////////////////////////////////////////////////////////////////////
	/*setInterval(function(){
		currentLatLng.lat += 0.0001;
		currentLatLng.lng -= 0.0002;

		mapService.changeLatLng( currentLatLng );
		mapService.changeHead();
	},500);*/

	/*$rootScope.$on( BroadcastAPI.MOVE_GO, function(){
		currentLatLng[0] += 0.0001;
		_droneInMap.changeLatLng( currentLatLng );
	});
	$rootScope.$on( BroadcastAPI.MOVE_BACK, function(){
		currentLatLng[0] -= 0.0001;
		_droneInMap.changeLatLng( currentLatLng );
	});
	$rootScope.$on( BroadcastAPI.MOVE_LEFT, function(){
		_droneInMap.changeHead(1);
	});
	$rootScope.$on( BroadcastAPI.MOVE_RIGHT, function(){
		_droneInMap.changeHead(-1);
	});*/

});