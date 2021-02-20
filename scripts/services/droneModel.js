kindFramework.service( 'DroneModel', function( $rootScope, BroadcastAPI, $filter,PopupManager ){

	this.secondTime = 0;
	this.totalSecondTime = 0;
	this.timer = 512;

	this.lat = 0;
	this.lon = 0;
	this.alt = 0;
	this.speed = 0;
	this.vz = 0;

	this.missionNum = 0; //드론에 업로드되어있는 미션 갯수

	this.saveCustumMode = null;
	this.saveBaseMode = null;
	this.saveMoveMode = null;
	this.saveTakeOffMod = null;
	this.seq = null;
	this.saveCurrentMissionMode = "";
	this.currentMissionNum = 0;
	this.missionLength = 0;

	this.init = function(){
		this.saveCustumMode = null;
		this.saveBaseMode = null;
		this.saveMoveMode = null;
		this.saveTakeOffMod = null;
		this.seq = null;
	};

	
	this.setGPS = function( data ){
		this.lat = data.lat / 10000000;
		this.lon = data.lon / 10000000;

		$rootScope.$broadcast( BroadcastAPI.SET_MAP_LATLNG );
	};

	this.setMissionNum = function( value ){
		this.missionNum = value;
	};

	///// heartbeat /////////////////////////////////////

	this.currentMode = {
		STABILIZE : "stabilize",
		AUTO : "auto",
	};

	
	this.setCustumMode = function( mode ){
		var str = "";
		switch( mode ){
			case 0 : 
			case 4 : //guidded
				str = this.currentMode.STABILIZE;
				break;
			default :
				str = this.currentMode.AUTO;
				break;
		}

		if( this.saveCustumMode != str ){
			this.saveCustumMode = str;
			$rootScope.$broadcast( BroadcastAPI.MODE_CHANGE, str );
		}
	};

	this.baseMode = {
		ENGINE_START : "engineStart",
		ENGINE_STOP : "engineStop"
	};

	/*this.setEngineState = function( mode ){
		
		var str = ""
		switch( mode ){
			case 81 : 
			case 89 :
				str = this.baseMode.ENGINE_STOP;
				break;

			case 209 : 
			case 217 :
				str = this.baseMode.ENGINE_START;
				break;
		}

		if( this.saveBaseMode != str ){
			this.saveBaseMode = str;
			$rootScope.$broadcast( BroadcastAPI.ENGIN_STATE, str );
		}
	}*/

	this.setEngineState = function(){
		
		if( this.saveBaseMode == this.baseMode.ENGINE_STOP ){
			this.saveBaseMode = this.baseMode.ENGINE_START;
		}else{
			this.saveBaseMode = this.baseMode.ENGINE_STOP;
		}
		$rootScope.$broadcast( BroadcastAPI.ENGIN_STATE, this.saveBaseMode );
	};
	
	this.setHeartbeatData = function(){
		//this.setCustumMode( message.custom_mode );
		//this.setEngineState( message.base_mode );
	};

	this.moveMode = {
		HOVERING : "hovering",
		MOVE : "move"
	};

	
	this.setSpeed = function( message ){
		this.speed = message.airspeed.toFixed( 2 );
		var str = "";
		if( this.alt > 1 && this.speed < 1 && this.vz === 0 ){
			str = this.moveMode.HOVERING;
		}else{
			str = this.moveMode.MOVE;
		}
		if( this.saveMoveMode != str ){
			this.saveMoveMode = str;
			$rootScope.$broadcast( BroadcastAPI.HOVERING_STATE,  str );
		}
	};

	this.takeOffMode = {
		TAKEOFF : "takeoff",
		LAND : "land"
	};

	this.setTakeOff = function(){
		this.saveTakeOffMod = this.takeOffMode.TAKEOFF;
		$rootScope.$broadcast( BroadcastAPI.TAKOFF_STATE,  this.saveTakeOffMod );
	};
	this.setLand = function(){
		this.saveTakeOffMod = this.takeOffMode.LAND;
		$rootScope.$broadcast( BroadcastAPI.TAKOFF_STATE,  this.saveTakeOffMod );
	};

	
	this.setAlt = function( data ){
		this.alt = data.alt.toFixed(2);
		/*
		var str = "";
		if( this.alt > 1 ){
			str = this.takeOffMode.TAKEOFF;
		}else{
			str = this.takeOffMode.LAND;
		}
		if( this.saveTakeOffMod != str ){
			this.saveTakeOffMod = str;
			$rootScope.$broadcast( BroadcastAPI.TAKOFF_STATE,  str );
		}*/
	};

	this.missionMode = {
		START : "start",
		END : "end"
	};
	
	this.missionStart = function(){
		this.saveCurrentMissionMode = this.missionMode.START;
		$rootScope.$broadcast( BroadcastAPI.MISSION_STATE,  this.missionMode.START );
	};

	this.missionStop = function(){
		currentMissionNum = 0;
		this.saveCurrentMissionMode = this.missionMode.END;
		$rootScope.$broadcast( BroadcastAPI.MISSION_STATE, this.missionMode.END );
	};

	
	this.setCurrentMision = function( value ){
		this.currentMissionNum = value;
	};

	this.setMissionLength = function( num ){
		this.missionLength = num;
	};

	this.operation = {
		GET : "get",
		PASS : "pass"
	};
	this.currentOperation = "";
	this.setOperationControl = function( message ){
		if( message.ack === 0 ){
			var str = "";
			switch( message.control_request ){
				case 0 :
					str = this.operation.GET;
					break;

				case 1 :
					str = this.operation.PASS;
					break;
			}
			if( this.currentOperation !== str ){
				this.currentOperation = str;
				$rootScope.$broadcast( BroadcastAPI.OPERATION_CONTROL_STATE,  str );
			}

		}else{
			if( message.control_request === 0 ){
				PopupManager.alert($filter('translate')('FAIL_GET_CONTROLL'));
			}else if( message.control_request == 1 ){
				PopupManager.alert($filter('translate')('FAIL_PASS_CONTROLL'));
			}
		}
	};

});