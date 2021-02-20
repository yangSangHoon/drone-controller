kindFramework.controller('controllSpeedAltitudeController', function( $scope, BroadcastAPI, $element, JoystickService, SockManagerService, ControllerDataPool, DroneModel ){
	
	var joystick = new JoystickService();
	joystick.init({
		handle : $element.find('.joystick'),
		area : $element,
		range : {
			top : 2100,
			bottom : 900,
			left: 900,
			right : 2100
		},
		//revert : 'x',
		revert : true,
		move : function(value){
			ControllerDataPool.send({
				chan4_raw : Math.floor( value.x ),
				chan3_raw : Math.floor( value.y )
			});
		}
	});

	/*
	var troatleValue = 992; //rage 992~2004
	var troatleMin = 992;
	var troatleMax = 2004;
	var moveTimer = null;
	joystick.init({
		handle : $element.find('.joystick'),
		area : $element,
		range : {
			top : 10,
			bottom : -10,
			left: 992,
			right : 2013
		},
		//revert : 'x',
		revert : true,
		move : function(value){

			if( moveTimer != null ) clearInterval( moveTimer );

			moveTimer = setInterval(function(){

				troatleValue += value.y;
				if( troatleValue < troatleMin ) troatleValue = troatleMin;
				if( troatleValue > troatleMax ) troatleValue = troatleMax;

				ControllerDataPool.send({
					chan4_raw : Math.floor( value.x ),
					chan3_raw : Math.floor( troatleValue )
				});

			}, 50 );
			
		},
		stop: function( value ){
			clearInterval( moveTimer );
		}
	});*/
	
	function moveController( tar ){
		$element.animate({ left : tar }, {duration: 1000, easing: 'easeOutBounce'});	
	}
	
	function hideController(){
		moveController( -120 );
	}

	function showController(){
		moveController( 35 );
	}

	$scope.$on( BroadcastAPI.MODE_CHANGE, function( e, mode ){
		if( mode == DroneModel.currentMode.AUTO ){ //auto
			hideController();
		}else{
			showController();
		}
	});

	

	//test
	/*
	$scope.up = upClick;
	$scope.down = downClick;
	$scope.left = leftClick;
	$scope.right = rightClick;
	function upClick(){
		SockManagerService.send("1");
		//$scope.$emit( BroadcastAPI.UP_ALTITUDE );
	}
	function downClick(){
		SockManagerService.send("3");
		//$scope.$emit( BroadcastAPI.DOWN_ALTITUDE  );
	}
	function leftClick(){
		SockManagerService.send("2");
		//$scope.$emit( BroadcastAPI.DOWN_SPEED );
	}
	function rightClick(){
		SockManagerService.send("4");
		//$scope.$emit( BroadcastAPI.UP_SPEED );
	}*/
});