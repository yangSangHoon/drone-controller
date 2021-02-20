kindFramework.service('SendProtocol', function( SockManagerService, PopupManager ){

	this.getProtocolData = function(){
		return {};
	};

	this.setAuto = function(){
		var data = this.getProtocolData();
		data.pname="setmode";
		data.cmode = 3;
		this.sendData( data );
	};

	this.setManually = function(){
		var data = this.getProtocolData();
		data.pname="setmode";
		data.cmode = 4;	//GRIDED
		this.sendData( data );
	};

	this.hovering = function(){
		var data = this.getProtocolData();
		data.pname="setmode";
		data.cmode = 17;
		this.sendData( data );
	};

	this.resume = function(){
		this.setAuto();
	};

	this.startEngine = function(){
		var data = this.getProtocolData();
		data.pname="arm";
		data.arm = 1;
		this.sendData( data );	
	};

	this.stopEngine = function(){
		var data = this.getProtocolData();
		data.pname="arm";
		data.arm = 0;
		this.sendData( data );	
	};

	this.returnToLaunch = function(){
		var data = this.getProtocolData();
		data.pname="return_lunch";
		this.sendData( data );	
	};

	this.takeOff = function(){
		var data = this.getProtocolData();
		data.pname="takeoff";
		data.alt=10;
		this.sendData( data );	
	};

	this.land = function(){
		var data = this.getProtocolData();
		data.pname="land";
		this.sendData( data );
	};

	this.startMission = function(){
		var data = this.getProtocolData();
		data.pname="mission_start";
		data.mstart=1;
		data.mend=100;
		this.sendData( data );
	};

	this.startMissionEndless = function(missionNum){
		var data = this.getProtocolData();
		data.pname="endless_start";
		data.mend=missionNum;
		this.sendData( data );
	};

	this.waypoint = function(dataObj){
		var data = this.getProtocolData();
		data.pname="takeoff";
		data.lat = dataObj.lat;
		data.lon = dataObj.lng;
		data.alt = dataObj.alt;
		this.sendData( data );
	};

	this.getOperatorControl = function(){
		var data = {
			mode : 'mavlink',
			command : 5,
			control_request : 0,
			passkey : "key"
		};
		SockManagerService.send( data );
	};

	this.passOperatorControl = function(){
		var data = {
			mode : 'mavlink',
			command : 5,
			control_request : 1,
			passkey : "key"
		};
		SockManagerService.send( data );
	};

	this.sendData = function( dataObj ){
		SockManagerService.send( dataObj );
	};


});