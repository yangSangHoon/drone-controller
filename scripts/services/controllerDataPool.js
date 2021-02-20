kindFramework.service('ControllerDataPool', function(SockManagerService){
	var sendData = {
		mode : "rcOverride",
		chan1_raw : 1500,
		chan2_raw : 1500,
		chan3_raw : 1500,
		chan4_raw : 1500,
		chan5_raw : 1143,
		chan6_raw : 993,
		chan7_raw : 992,
		chan8_raw : 1500,
	};

	var isHome = false;
	var mode = 'STD';
	
	this.setHome = function( val ){
		isHome = val;
		this.checkMode();
	};

	this.changeMode = function( newMode ){
		mode = newMode;
		this.checkMode();
	};

	this.checkMode = function(){
		switch( mode ){
			case 'STD' :
				sendData.chan5_raw = isHome ? 1579 : 1146;
				break;

			case 'LTR' :
				sendData.chan5_raw = isHome ? 1662 : 1326;
				break;

			case 'AUTO' :
				sendData.chan5_raw = isHome ? 1862 : 1430;
				break;
		}
		this.send();
	};



	this.send = function( data ){
		$.extend( sendData, data );
		SockManagerService.send( sendData );
	};

});