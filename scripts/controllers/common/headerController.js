kindFramework.controller('headerController', function( $element, $scope, $rootScope, ModalService, BroadcastAPI, SendDataService, DroneModel, SockManagerService ){

	$scope.settingClick = function(){
		/*ModalService.showPopup({
			templateUrl: "views/setting/setting.html",
			controller: "SettingController"
		}).then(function(modal) {
			
		});*/

		ModalService.showPopup({
			templateUrl: 'views/setting/setting.html',
			controller: 'SettingController',
			position : {height: $(window).height() },
			animate : { right : 0 },
			animateSpeed : 300,
			id : 'settingPopup'
		});
	};

	$scope.$on( BroadcastAPI.DEBUGGER_SHOW, function(){
		ModalService.showModal({
			templateUrl: "views/setting/debug.html",
			controller: "debuggerController",
			css : {"marginTop" : 0 }
		});
	});

	$scope.emergencyStop = function(){
		SendDataService.land();
		//window.location.reload(); 
	};
	
	function hideLogoutPop(){
		isLogoutPop = false;
		logoutPop.stop().animate({ top : "75px", opacity : 0.1 }, function(){
			logoutPop.css({display:'none'});
		});
	}

	var logoutPop = $element.find('.logout_pop');
	var isLogoutPop = false;
	$scope.showLogoutPop = function(){
		if( isLogoutPop === true ){
			hideLogoutPop();
		}else{
			isLogoutPop = true;
			logoutPop.css({display:'block'});
			logoutPop.stop().animate({ top : "65px", opacity : 1 });
		}
	};

	$scope.exitLogoutPop = function(){
		hideLogoutPop();
	};

	$scope.logout = function(){
		SockManagerService.close();
		location.href="#/login";
	};

	///// info controller ////////////////////////

	var con = $element.find('.info_con');
	con.hide();
	
	var isShow = false;
	
	function showInfo(){
		isShow = true;
		//con.stop().animate({'marginTop' : 0 });
		//con.css({'marginTop' : 0 })
		con.show();
		$element.find('.info').addClass('on');
	}

	function infoHide(){
		isShow = false;
		//con.stop().animate({'marginTop' : hideTop });
		//con.css({'marginTop' : hideTop })
		con.hide();
		$element.find('.info').removeClass('on');
	}
	
	$scope.showInfo = function(){
		if( isShow ){
			infoHide();
		}else{
			showInfo();
		}
	};

	$scope.hide = function(){
		infoHide();		
	};

	

	/////////////////////////////

	$scope.gpsNum = 2;
	$scope.remaining = 100;
	$scope.signal = 100;
	$scope.voltage = 100;
	$scope.am = 100;
	$scope.lat = 37.6688612;
	$scope.lng = 126.7435344;
	$scope.alt = 7;

	$scope.batteryClass = "battery s1";

	$scope.$on( BroadcastAPI.DRONE_STATUS, function( e,  data ){
		if( data.satellites_visible !== undefined && data.satellites_visible !== null ) $scope.gpsNum = data.satellites_visible || 0;			//gps 연결수
		if( data.drop_rate_comm !== undefined && data.drop_rate_comm !== null ){
			$scope.signal = 100 - data.drop_rate_comm;			
			if( $scope.signal > 70 ){
				$scope.signalClass = "signal s1";
			}else if( $scope.signal > 40 ){
				$scope.signalClass = "signal s2";
			}else if( $scope.signal > 20 ){
				$scope.signalClass = "signal s3";
			}else{
				$scope.signalClass = "signal s4";
			}

		} 
		if( data.voltage_battery !== undefined && data.voltage_battery !== null ){
			$scope.voltage = data.voltage_battery;
		} 
		if( data.battery_remaining !== undefined && data.battery_remaining !== null ){//밧데리 잔량
			if( data.battery_remaining < 0 ){
				$scope.remaining = 0;
			}else{
				$scope.remaining = data.battery_remaining;		
			}

			if( $scope.remaining > 80 ){
				$scope.batteryClass = "battery s1";
			}else if( $scope.remaining > 60 ){
				$scope.batteryClass = "battery s2";
			}else if( $scope.remaining > 30 ){
				$scope.batteryClass = "battery s3";
			}else{
				$scope.batteryClass = "battery s4";
			}
		}

		if( data.current_battery !== undefined && data.current_battery !== null ) $scope.am = data.current_battery;					//암페어
		if( data.sub_mode !== undefined && data.sub_mode !== null ) $scope.satus = data.sub_mode;							//상태
		if( data.time_unix_usec !== undefined && data.time_unix_usec !== null ) $scope.totalTime = data.time_unix_usec;		

		$scope.$apply();

		$scope.lat = DroneModel.lat;
		$scope.lng = DroneModel.lon;
		$scope.alt = DroneModel.alt;
	});
	
	/*function checkTime(){
		var time = DroneModel.secondTime;
		var minute = Math.floor( time / 60 );
		var second = time - minute * 60;
		$scope.play_minute = minute;
		$scope.play_second = second;

		var totalTime = DroneModel.totalSecondTime;
		var hour2 = Math.floor( totalTime / 3600 );
		var minute_t = totalTime - hour2 * 3600;
		var minute2 = Math.floor( minute_t / 60 );
		var second2 = minute_t - minute2 * 60;
		$scope.total_hour = hour2;
		$scope.total_minute = minute2;
		$scope.total_second = second2;

		$scope.$apply();
	}
	
	if( DroneModel.timer !== null ) clearInterval( DroneModel.timer );
	DroneModel.timer = setInterval( function(){
		DroneModel.secondTime++;
		DroneModel.totalSecondTime++;
		checkTime();
	}, 1000 );
*/

	$scope.$on( BroadcastAPI.PLAY_TIME, function( e,  data ){
		var time = Math.floor( data.time_boot_ms * 0.001 );
		var minute = Math.floor( time / 60 );
		var second = time - minute * 60;
		$scope.play_minute = minute;
		$scope.play_second = second;

		/*var totalTime = Math.floor( data.time_unix_usec * 0.001 );
		var minute2 = Math.floor( totalTime / 60 );
		var second2 = totalTime - minute2 * 60;
		$scope.total_minute = minute2;
		$scope.total_second = second2;*/

	});

	$scope.$on( BroadcastAPI.TOTAL_TIME, function( e,  data ){
		if( data.time_boot_ms != null ){
			var time = Math.floor( data.time_boot_ms * 0.001 );
			var minute = Math.floor( time / 60 );
			var second = time - minute * 60;
			$scope.total_minute = minute;
			$scope.total_second = second;
		} 
	});



});