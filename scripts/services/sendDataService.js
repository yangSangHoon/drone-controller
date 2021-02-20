kindFramework.service('SendDataService', function( SockManagerService, DroneModel ){

	this.getProtocolData = function(){
		return {
			mode : 'protocal',
			tsys : 1,
			tcomp : 1
		};
	};

	this.setMode = function(){
		
	};

	//////mav ///////////////////////////////////////////

	this.getMavCmdData = function(){
		return {
			mode : 'mavCmd',
			confirmation : 0,
			param1 : 0,
			param2 : 0,
			param3 : 0,
			param4 : 0,
			param5 : 0,
			param6 : 0,
			param7 : 0
		};
	};


	this.startEngine = function(){
		var dataObj = this.getMavCmdData();
		dataObj.command = 400;
		dataObj.param1 = 1;
		this.sendData( dataObj );		
	};

	this.stopEngine = function(){
		var dataObj = this.getMavCmdData();
		dataObj.command = 400;
		dataObj.param1 = 0;
		this.sendData( dataObj );		
	};

	this.takeOff = function(){
		var dataObj = this.getMavCmdData();
		dataObj.param5 = DroneModel.lat;
		dataObj.param6 = DroneModel.lon;
		dataObj.param7 = DroneModel.alt;
		data.command = 22;
		this.sendData( dataObj );	
	};

	this.land = function(){
		var dataObj = this.getMavCmdData();
		dataObj.param5 = DroneModel.lat;
		dataObj.param6 = DroneModel.lon;
		dataObj.param7 = DroneModel.alt;
		dataObj.command = 21;
		this.sendData( dataObj );	
	};

	this.startMission = function(){
		var dataObj = this.getMavCmdData();
		dataObj.command = 300;
		dataObj.param1 = 1;
		dataObj.param2 = DroneModel.missionNum;
		dataObj.param7 = 1;
		this.sendData( dataObj );	
	};

	this.stopMission = function(){
		var dataObj = this.getMavCmdData();
		dataObj.command = 300;
		dataObj.param1 = 1;
		dataObj.param2 = DroneModel.missionNum;
		dataObj.param7 = 0;
		this.sendData( dataObj );	
	};

	this.resume = function(){

	};

	this.hovering = function(){
		
	};

	//자동
	this.setAuto = function(){
		var dataObj = this.getMavCmdData();
		dataObj.command = 176;
		dataObj.param1 = 220;
		this.sendData( dataObj );	
	};

	this.setSemiAuto = function(){
		var dataObj = this.getMavCmdData();
		dataObj.command = 176;
		dataObj.param1 = 208;
		this.sendData( dataObj );	
	};

	//수동
	this.setManually = function(){
		var dataObj = this.getMavCmdData();
		dataObj.command = 176;
		dataObj.param1 = 192;
		this.sendData( dataObj );	
	};

	this.returnToLaunch = function(){
		var dataObj = this.getMavCmdData();
		dataObj.command = 20;
		dataObj.param7 = 1;
		this.sendData( dataObj );	
	};

	this.sendData = function( dataObj ){
		SockManagerService.send( dataObj );
	};

});