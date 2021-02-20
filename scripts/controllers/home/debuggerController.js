kindFramework.controller('debuggerController', function( $scope, $element, BroadcastAPI ){
	
	$scope.remove = function(){
		$("#txtArea").html("");
	};
	
	function setTxt(data){
		var daveTxt = $element.find("#txtArea").html();
		daveTxt += "<br/>[" +  data.time_boot_ms + "] " + data.name + ": " + data.value;
		setTxt3(daveTxt);
	}

	function setTxt2(data){
		var typeStr = "";
		switch( data.severity ){
			case 0 : //"MAV_SEVERITY_EMERGENCY" :
				typeStr = "EMERGENCY";
				break;

			case 1 : //"MAV_SEVERITY_ALERT" :
				typeStr = "EMERGENCY";
				break;

			case 2 : //"MAV_SEVERITY_CRITICAL" :
				typeStr = "CRITICAL";
				break;

			case 3 : //"MAV_SEVERITY_ERROR" :
				typeStr = "ERROR";
				break;

			case 4 : //"MAV_SEVERITY_NOTICE" :
				typeStr = "NOTICE";
				break;

			case 5 : //"MAV_SEVERITY_INFO" :
				typeStr = "INFO";
				break;

			case 6 : //"MAV_SEVERITY_DEBUG" :
				typeStr = "DEBUG";
				break;
		}
		var daveTxt = $element.find("#txtArea").html();
		daveTxt += "<br/>[" +  typeStr + "] " + data.text;
		setTxt3(daveTxt);
	}

	/*function setTxt3(daveTxt){
		var txtArea = $element.find("#txtArea");
		txtArea.html( daveTxt );
		txtArea.scrollTop( txtArea[0].scrollHeight );
	}*/

	function setFlightMode(data){
		var str = "";
		switch( data.flight_mode){
			case 11 :
				str = "자세제어 모드";
				break;
			case 12 :
				str = "고도/속도/헤딩 제어 모드";
				break;
			case 13 :
				str = "관성속도(Vn, Ve)/고도 제어 모드";
				break;
			case 21 :
				str = "호버링 모드";
				break;
			case 22 :
				str = "자동 이륙 모드";
				break;
			case 23 :
				str = "자동 착륙 모드";
				break;
			case 24 :
				str = "점항법 모드";
				break;
			case 25 :
				str = "자동 항법 모드";
				break;
			case 31 :
				str = "비상 모드";
				break;
		}
		$scope.FlightMode = str;
	}

	$scope.$on( BroadcastAPI.DEBUGGER, function( e,  data ){
		//console.log( "data.messageID  : " +data.messageID  );
		switch( data.messageID ){

			case 24 : // GPS_RAW_INT
				
				$scope.ISS_LAT_GPS = data.lat / 0x1E7;
				$scope.ISS_LON_GPS = data.lon / 0x1E7;
				$scope.ISS_ALT_GPS = data.alt / 1000;
				$scope.TimeStamp = data.time_usec;
				break;	

			case 30 : //ATTITUDE
				$scope.ISS_Phi = data.roll * 180 / Math.PI;
				$scope.ISS_Theta = data.pitch * 180 / Math.PI;
				$scope.ISS_Psi = data.yaw * 180 / Math.PI;

				$scope.TimeStamp = data.time_boot_ms;
				break;		

			case 27 : //RAW_IMU
				$scope.ISS_P = data.xgyro;
				$scope.ISS_Q = data.ygyro;
				$scope.ISS_R = data.zgyro;
				$scope.ISS_Ax = data.xacc;
				$scope.ISS_Ay = data.yacc;
				$scope.ISS_Az = data.zacc;

				$scope.TimeStamp = data.time_usec;
				break;

			case 32 : //LOCAL_POSITION_NED
				$scope.ISS_Vn_GPS = data.vx;
				$scope.ISS_Ve_GPS = data.vy;
				$scope.ISS_Vd_GPS = data.vz;

				$scope.TimeStamp = data.time_boot_ms;
				break;		

			case 36 : //SERVO_OUTPUT_RAW
				$scope.Motor1 = data.servo1_raw;
				$scope.Motor2 = data.servo2_raw;
				$scope.Motor3 = data.servo3_raw;
				$scope.Motor4 = data.servo4_raw;
				$scope.Motor5 = data.servo5_raw;
				$scope.Motor6 = data.servo6_raw;
				$scope.Motor7 = data.servo7_raw;
				$scope.Motor8 = data.servo8_raw;

				$scope.TimeStamp = data.time_usec;
				break;		

			case 206 :
				setFlightMode( data );
				break;

			/*case 28 : // RAW_PRESSURE
				$scope.ISS_Alt_Baro = data; //?? 어떤 파라미터?
				break;		

			case 35 : // RC_CHANNELS_RAW
				$scope.aaaaaa = data.chan1_raw; //?? 화면 없음
				break;		*/

			case 251 : //debugging
			case 252 : //debugging
				setTxt( data );

				$scope.TimeStamp = data.time_boot_ms;
				break;

			case 253 : //debugging
				setTxt2( data );
				break;
		}
	});


	
	
});