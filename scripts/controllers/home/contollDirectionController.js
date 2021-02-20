kindFramework.controller('controllDirectionController', function( $scope, $rootScope, $element, BroadcastAPI, JoystickService, SockManagerService, ControllerDataPool, DroneModel ){

	var joystick = new JoystickService();
	joystick.init({
		handle : $element.find('.joystick'),
		area : $element,
		range : {
			top : 900,
			bottom : 2100,
			left: 900,
			right : 2100 
		},
		revert : true,
		move : function(value){
			$scope.frontBackValue = "fb : " + value.y;
			$scope.leftRightValue = "lr : " + value.x;
			$scope.$apply();
			ControllerDataPool.send({
				chan2_raw : Math.floor( value.y ),
				chan1_raw : Math.floor( value.x )
			});
		}
	});

	function moveController( tar ){
		$element.animate({ right : tar }, {duration: 1000, easing: 'easeOutBounce'});	
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

	


	/*$scope.up = upClick;
	$scope.down = downClick;
	$scope.left = leftClick;
	$scope.right = rightClick;
	$scope.mouseUp = mouseUp;
	
	function upClick(){
		//$rootScope.$broadcast( "aaa" );
		SockManagerService.send("5");
		$scope.$emit( BroadcastAPI.MOVE_GO );
		//$element.find('img').attr('src', 'images/controller_2_up.png' );
	}
	function downClick(){
		SockManagerService.send("7");
		$scope.$emit( BroadcastAPI.MOVE_BACK );
		//$element.find('img').attr('src', 'images/controller_2_down.png' );
	}
	function leftClick(){
		SockManagerService.send("6");
		$scope.$emit( BroadcastAPI.MOVE_LEFT );
		//$element.find('img').attr('src', 'images/controller_2_left.png' );
	}
	function rightClick(){
		SockManagerService.send("8");
		$scope.$emit( BroadcastAPI.MOVE_RIGHT );
		//$element.find('img').attr('src', 'images/controller_2_right.png' );
	}
	
	function mouseUp(){
		//$element.find('img').attr('src', 'images/controller_2.png' );
	}*/

});