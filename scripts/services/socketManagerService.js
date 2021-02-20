kindFramework.service( 'SockManagerService', function( $rootScope, BroadcastAPI, DroneModel, PopupManager ){

	//var socket;
	var ws = null;

	this.connect = function(obj){
		var _this = this;

		return

		if( ws !== null ) return;

		var ip = "192.168.0.100";
		var port = "8080";
		if( obj !== undefined && obj !== null && obj.ip !== undefined && obj.ip !== null && obj.ip !== "" ) ip = obj.ip;
		if( obj !== undefined && obj !== null && obj.port !== undefined && obj.port !== null && obj.port !== "" ) port = obj.port;
		console.log( 'ip : ' + ip );
		console.log( 'port : ' + port );
		ws = new WebSocket( "ws://" + ip + ":" + port + "/" );
		
		// When connection opens
		ws.onopen = function() {
				var connectMsg = {
				mode : 'connect',
				sysid : 1,
				compid : 1,
				msgid : [0]
			};
			ws.send(JSON.stringify(connectMsg));
			console.log("connected to websocket server");

			if( obj !== undefined && obj !== null && obj.success !== undefined && obj.success !== null ) obj.success();
		};
		
		ws.onclose = function(){
			console.log('disconnected');
			ws = null;
			PopupManager.alert('소켓이 연결되지 않았습니다.');
			window.disconnectedSocket = true;
			if( obj !== undefined && obj !== null && obj.error !== undefined && obj.error !== null ) obj.error();
			
			//$.data({ 'isConnect' : false })
			//$rootScope.$broadcast( BroadcastAPI.DRONT_STATUS, {status : 'stay'} );
		};

		// When message arrives from the server 
		ws.onmessage = function(message) {
			var data = JSON.parse(message.data);
			_this.onMessage( data );
		};
	};

	this.close = function(){
		if( ws !== undefined && ws !== null && window.disconnectedSocket === false ) ws.close();
	};

	this.onMessage = function(message){
		//console.log( "messageID : " + message.messageID );

		switch( message.messageID ){

			case 0 :
				DroneModel.setHeartbeatData( message );
				break;

			case 1 :
				$rootScope.$broadcast( BroadcastAPI.DRONE_STATUS, message );
				break;
			
			case 2  :
				$rootScope.$broadcast( BroadcastAPI.DRONE_STATUS, message );
				$rootScope.$broadcast( BroadcastAPI.PLAY_TIME, message );
				
				break;

			case 4  :
				$rootScope.$broadcast( BroadcastAPI.GYROSCOPE_PITCH, message );
				
				break;

			case 22  :
				$rootScope.$broadcast( BroadcastAPI.SETTING_ACK, message );
				
				break;

				
			case 24  : 
				$rootScope.$broadcast( BroadcastAPI.DRONE_STATUS, message );
				break;

			case 30  : 
				$rootScope.$broadcast( BroadcastAPI.BANK_ROLL, message );
				$rootScope.$broadcast( BroadcastAPI.DRONE_STATUS, message );
				$rootScope.$broadcast( BroadcastAPI.GYROSCOPE_PITCH, message );
				break;

			case 33  :
				$rootScope.$broadcast( BroadcastAPI.DRONE_STATUS, message );
				$rootScope.$broadcast( BroadcastAPI.VERTICAL_SPEED, message.vz );
				$rootScope.$broadcast( BroadcastAPI.DRONE_DIRECTION, message.hdg );
				DroneModel.vz = message.vz;//
				DroneModel.setGPS( message );

				break;


			case 42 : //current
				DroneModel.setCurrentMision( message.seq );
				//console.log( "message.seq : " + message.seq );
				break;

			case 44 : //mission count
				DroneModel.setMissionNum( message.count );			
				$rootScope.$broadcast( BroadcastAPI.GET_MISSION_ITEM, message );
				break;

			case 39 : //mission item
				$rootScope.$broadcast( BroadcastAPI.GET_MISSION_ITEM, message );
				break;

			case 74  : 
				$rootScope.$broadcast( BroadcastAPI.SPEED, message );
				$rootScope.$broadcast( BroadcastAPI.ALTITUDE, message );
				//$rootScope.$broadcast( BroadcastAPI.DRONE_DIRECTION, message );
				DroneModel.setAlt( message );
				DroneModel.setSpeed( message );
				break;

			case 47  : 	//mission ack	 
				console.log( "mission ack : " + message.command );

				break;

			case 77  : 	//command ack	
				this.commandAckCheck( message );
				break;

			case 253  : 	//status text	
				this.statusCheck( message );
				
				break;

			case 254  : 	//status text	
				console.log( "254 : " + message.command );
				
				break;

			default :

				break;
		}

		$rootScope.$broadcast( BroadcastAPI.DEBUGGER, message );
	};

	this.commandAckCheck = function( message ){
		console.log( "message.command : " + message.command );
		//if( message.result == 0 ){
			switch( message.command ){

				case 21 : 	//land
				case 20 : 	//return to home
					DroneModel.missionStop();
					DroneModel.setLand();
					break;
				case 6 : 	//제어권응답
					DroneModel.setOperationControl( message );
					break;
				case 300 : //missionStart
					DroneModel.missionStart();
					break;

				case 22 : //takeoff
					DroneModel.setTakeOff();
					break;

				case 400 : //enginStart
					DroneModel.setEngineState();
					break;
				
			}
		//}
		
	};

	this.statusCheck = function( message ){
		console.log( "statusCheck message.text  : " + message.text  );
		switch( this.getRealString( message.text ) ){
			case "flight plan received" : 
				$rootScope.$broadcast( BroadcastAPI.MISSION_UPLOAD_COMPLETE, message );
				break;

			default : 
				if( message.text.indexOf("DISARMING MOTORS") > -1 ){
					PopupManager.toast( "엔진 정지" );
				}else if( message.text.indexOf("ARMING MOTORS") > -1 ){
					PopupManager.toast( "엔진 시동" );
				}else if( message.text.indexOf("Initialising APM") > -1 ){
					PopupManager.toast( "미션 시작" );
					DroneModel.secondTime = 0;
					$rootScope.$broadcast( BroadcastAPI.MISSION_START, message );
				}else if( message.text.indexOf("Reached Command") > -1 ){//미션번호받는부분
					var num = message.text.split("#")[1];
					var n = this.getRealString( num );
					PopupManager.toast( n + '번 미션수행중' );
				}else{
					PopupManager.alert( message.text, message.severity );	
				}
				break;
		}

		$rootScope.$broadcast( BroadcastAPI.STATUS_MESSAGE, message );
	};

	//쓰레기 스트링 값 제거
	this.getRealString = function( str ){

		var realString = "";
		for( var i = 0; i<str.length; i++ ){
			if( str.charCodeAt(i) > 0 ){
				realString += str[i];
			}
		}

		return realString;
	};

	this.send = function( cData ){
		var data = {
			mode : 'protocol',
			tsys : 1,
			tcomp : 1
		};
		$.extend( data, cData );
		console.log( ' --------send:start------------' );
		for( var item in cData ){
			console.log( item + ' : ' + cData[item] );
		}
		if( ws !== undefined && ws !== null && ws.readyState === 1 ){
			ws.send( JSON.stringify(data) );
			console.log( ' --send:end--' );	
		}else{
			console.log( ' --!!! socekt is NULL or not ready !!!--' );	
		}
		//socket.emit('message', message );
	};

});
