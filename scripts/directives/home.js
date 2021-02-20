kindFramework.directive('header', function(){
	return {
		templateUrl : 'views/common/header.html',
		controller : "headerController",
		scope : true
	};
});

kindFramework.directive('altitude', function(){
	return {
		templateUrl : 'views/home/altitude.html',
		controller : "altitudeController",
		scope : true
	};
});

kindFramework.directive('cameraViewMain', function(){
	return {
		templateUrl : 'views/home/camera_view_main.html',
		controller : "cameraViewMainController",
		scope : true
	};
});

kindFramework.directive('googleMap',['$timeout', function(){
	return {
		templateUrl : 'views/home/camera_view_map.html',
		controller : "cameraViewMapController",
		scope : true
	};
}]);

kindFramework.directive('cameraViewSub', function(){
	return {
		templateUrl : 'views/home/camera_view_sub.html',
		controller : "cameraViewSubController",
		scope : true
	};
});

kindFramework.directive('controllDirection', function(){
	return {
		templateUrl : 'views/home/controller_direction.html',
		controller : 'controllDirectionController',
		scope : true
	};
});

kindFramework.directive('controllSpeedAltitude', function(){
	return {
		templateUrl : 'views/home/controller_speed_altitude.html',
		controller : "controllSpeedAltitudeController",
		scope : true
	};
});

kindFramework.directive('board', function(){
	return {
		templateUrl : 'views/home/data_board.html',
		controller : "dataBoardController",
		scope : true
	};
});

kindFramework.directive('sideBtn', function(){
	return {
		templateUrl : 'views/home/side_btn.html',
		controller : "sideBtnController",
		scope : true
	};
});

kindFramework.directive('speed', function(){
	return {
		templateUrl : 'views/home/speed.html',
		controller : 'speedController',
		scope : true
	};
});

kindFramework.directive('bottomBtns', function(){
	return {
		templateUrl : 'views/home/bottom_btns.html',
		controller : 'bottomBtnsController',
		scope : true
	};
});

kindFramework.directive('gyroscope', function(){
	return {
		templateUrl : 'views/home/gyroscope.html',
		controller : 'gyroscopeController',
		scope : true
	};
});

kindFramework.directive('ptzDrone', function(){
	return {
		templateUrl : 'views/home/ptz_drone.html',
		controller : 'ptzDroneController',
		scope : true
	};
});

kindFramework.directive('bankBoard', function(){
	return {
		templateUrl : 'views/home/bank_board.html',
		controller : 'bankBoardController',
		scope : true
	};
});

kindFramework.directive('verticalSpeed', function(){
	return {
		templateUrl : 'views/home/vertical_speed.html',
		controller : 'verticalSpeedController',
		scope : true
	};
});

kindFramework.directive('debugger', function(){
	return {
		templateUrl : 'views/home/debugger.html',
		controller : 'debuggerController',
		scope : true
	};
});

kindFramework.directive('tilt', function(){
	return {
		templateUrl : 'views/home/tilt.html',
		controller : 'tiltController',
		scope : true
	};
});


kindFramework.directive('controllMode', function(){
	return {
		templateUrl : 'views/home/controll_mode.html',
		controller : 'controllModeController',
		scope : true
	};
});


kindFramework.directive('direction', function(){
	return {
		templateUrl : 'views/home/direction.html',
		controller : 'directionController',
		scope : true
	};
});

kindFramework.directive('settingAarea', function(){
	return {
		templateUrl : 'views/setting/setting.html',
		controller : 'settingController',
		scope : true
	};
});


kindFramework.directive('stateArea', function(){
	return {
		templateUrl : 'views/home/state_area.html',
		controller : 'stateAreaController',
		scope : true
	};
});

kindFramework.directive('currentState', function(){
	return {
		templateUrl : 'views/home/current_state.html',
		controller : 'currentStateController',
		scope : true
	};
});

