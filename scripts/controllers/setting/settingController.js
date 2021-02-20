kindFramework.controller('SettingController', function( $scope, $element, close, ModalService, BroadcastAPI, PopupManager, SockManagerService ){

	var isGet = null;
	var getId = 20;
	var setId = 22;
	var submitNum = 0;

	
	function getData(obj){
		var data = {
			param_type : "MAV_PARAM",
		};
		$.extend( data, obj );
		return data;
	}
	
	function getDataList(){
		var list = [];
		list.push( getData({	//비행가능 시간
			param_id : "LMT_FLIGHT_TIME",
			param_value : $scope.LMT_FLIGHT_TIME
		}) );

		list.push( getData({	//비행가능 거리
			param_id : "LMT_FLIGHT_DIST",
			param_value : $scope.LMT_FLIGHT_DIST
		}) );

		list.push( getData({	//비행 최대 속도
			param_id : "MAX_FLIGHT_SPD",
			param_value : $scope.MAX_FLIGHT_SPD
		}) );

		list.push( getData({	//홈설정 lat
			param_id : "HOME_LOC_LAT",
			param_value : $scope.HOME_LOC_LAT * 10000000
		}) );

		list.push( getData({	//홈설정 lng
			param_id : "HOME_LOC_LNG",
			param_value : $scope.HOME_LOC_LNG * 10000000
		}) );

		list.push( getData({	//고도상한
			param_id : "ALM_UPLMT_ALT",
			param_value : $scope.ALM_UPLMT_ALT * 0.01
		}) );

		list.push( getData({	//제어신호강도
			param_id : "ALM_SGN_COTROL",
			param_value : $scope.ALM_SGN_COTROL
		}) );

		list.push( getData({	//영상신호강도
			param_id : "ALM_SGN_VIDEO",
			param_value : $scope.ALM_SGN_VIDEO
		}) );

		list.push( getData({	//1차 Battery 잔량 경고
			param_id : "ALM_BATT_CAPA1",
			param_value : $scope.ALM_BATT_CAPA1
		}) );

		list.push( getData({	//2차 Battery 잔량 경고
			param_id : "ALM_BATT_CAPA2",
			param_value : $scope.ALM_BATT_CAPA2
		}) );

		list.push( getData({	//3차 Battery 잔량 경고
			param_id : "ALM_BATT_CAPA3",
			param_value : $scope.ALM_BATT_CAPA3
		}) );

		list.push( getData({	//1차 GPS 신호 이상
			param_id : "ALM_GPS_SGN1",
			param_value : $scope.ALM_GPS_SGN1
		}) );

		list.push( getData({	//2차 GPS 신호 이상
			param_id : "ALM_GPS_SGN2",
			param_value : $scope.ALM_GPS_SGN2
		}) );

		list.push( getData({	//GPS 최소 연결 수
			param_id : "ALM_GPS_CNT",
			param_value : $scope.ALM_GPS_CNT
		}) );

		list.push( getData({	//Battery 이상 발생시 Action
			param_id : "ACT_BATT_ALM",
			param_value : $scope.ACT_BATT_ALM
		}) );

		var errorNum = 0;
		if( $scope.ACT_CTRL_ERROR === true ){
			errorNum = 1;
		}
		list.push( getData({	//제어신호 이상 발생시 Action
			param_id : "ACT_CTRL_ERROR",
			param_value : errorNum
		}) );

		list.push( getData({	//제어 통신두절시 Hovering시간
			param_id : "CONN_ERR_HVR_TM",
			param_value :$scope.errorMinute * 60 + $scope.errorSecond
		}) );

		list.push( getData({	//고도제한 이상 발생시 Action
			param_id : "ACT_ALTD_ALM",
			param_value : $scope.ACT_ALTD_ALM
		}) );

		list.push( getData({	//고도이상시 Hovering시간
			param_id : "ALT_ERR_HVR_TM",
			param_value : $scope.hoveringMinute * 60 + $scope.hoveringSecond
		}) );

		for( var i = 0; i < list.length; i++ ){
			list[i].command = isGet ? getId : setId;
		}		

		return list;
	}
	
	/*function getSettingDataList(){
		var data = {
			command : 21
		};
		SockManagerService.send( data );
	}*/
	
	function submit(){
		var dataList = getDataList();
		for( var i = 0; i<10; i++ ){
			SockManagerService.send( dataList[i] );
		}
	}

	function submit2(){
		var dataList = getDataList();
		for( var i = 10; i<dataList.length; i++ ){
			SockManagerService.send( dataList[i] );
		}
	}
	
	function sendProtocol(){
		submitNum = 19;
		PopupManager.showProgress();
		submit();		
	}

	function getSettingData(){
		isGet = true;
		sendProtocol();
	}

	

	

	
	
	$scope.closeModal = function() {
		$element.animate({right: -$element.width() + "px"}, 300, function(){
			close(null, 500);
		});
	};

	$scope.commit = function(){
		$element.animate({right: -$element.width() + "px"}, 300, function(){
			close(null, 500);
		});
		
		/*isGet = false;
		sendProtocol();*/
	};

	

	getSettingData();
	
	

	$scope.$on( BroadcastAPI.SETTING_ACK, function( e, data ){
		submitNum--;
		if( submitNum == 9 ){	//10개만 먼저 보내서 10개 ack오면 다시 나머지 보냄
			submit2();
		}else if( submitNum === 0 && isGet === false ){	
			PopupManager.toast("저장되었습니다.");
			$element.animate({right: -$element.width() + "px"}, 300, function(){
				close(null, 500);
			});
		}

		if( isGet === true ){	//정보 받을떄
			$scope[data.param_id] = data.param_value;
		}
	});


	
	$scope.duggerShow = function(){
		ModalService.showModal({
				templateUrl: "views/setting/debug.html",
				controller: "debuggerController",
				css : {"marginTop" : 0 }
		});
	};


	//sample
	/*$scope.LMT_FLIGHT_DIST = 20//비행가능 거리
	$scope.MAX_FLIGHT_SPD = 50//비행 최대 속도
	$scope.HOME_LOC_LAT = 37.561192//홈설정 lat
	$scope.HOME_LOC_LNG = 127.030487//홈설정 lng
	$scope.ALM_UPLMT_ALT = 30//고도상한
	$scope.ALM_SGN_COTROL = 10//제어신호강도
	$scope.ALM_SGN_VIDEO = 15//영상신호강도
	$scope.ALM_BATT_CAPA1 = 50//1차 Battery 잔량 경고
	$scope.ALM_BATT_CAPA2 = 30//2차 Battery 잔량 경고
	$scope.ALM_BATT_CAPA3 = 10//3차 Battery 잔량 경고
	$scope.ALM_GPS_SGN1 = 7//1차 GPS 신호 이상
	$scope.ALM_GPS_SGN2 = 5//2차 GPS 신호 이상
	$scope.ALM_GPS_CNT = 5//GPS 최소 연결 수
	$scope.ACT_BATT_ALM = 1//Battery 이상 발생시 Action
	$scope.ACT_CTRL_ERROR = 3//제어신호 이상 발생시 Action 

	//제어 통신두절시 Hovering시간
	$scope.errorMinute = 10
	$scope.errorSecond = 20

	$scope.ACT_ALTD_ALM = 2//고도제한 이상 발생시 Action

	//고도이상시 Hovering시간
	$scope.hoveringMinute = 5
	$scope.hoveringSecond =35*/
});
