kindFramework.controller('ptzDroneController', function( $scope, $element, JoystickService ){

	var isShow = false;
	var tarRight = 0;
	$scope.toggle = function(){
		
		if( isShow === false ){
			isShow = true;
			tarRight = '0px';
			$element.find('.ptz_btn > i').addClass('open');
		}else{
			isShow = false;
			tarRight = -$element.width()+'px';
			$element.find('.ptz_btn > i').removeClass('open');
		}

		$element.animate({ right : tarRight },300 );
	};

	var joystick = new JoystickService();
	joystick.init({
		handle : $element.find('.joystick'),
		area :$element.find('.ptz_controller'),
		range : {
			top : 1000,
			bottom : -1000,
			left: -1000,
			right : 1000 
		},
		revert : true,
		move : function(){
			/*$scope.frontBackValue = "fb : " + value.y;
			$scope.leftRightValue = "lr : " + value.x;
			$scope.$apply();
			ControllerDataPool.send({
				chan3_raw : value.y,
				chan4_raw : value.x
			});*/
		}
	});

/*	var ptzData = {
		pan : 0,
		tilt : 0,
		zoom : 0,
		focus : 0
	}*/

	$element.find('#ptSlider').slider({
	    value: 0,
	    min: 0,
	    max: 100,
		slide: function( event, ui ) {
			console.log('ui : ' + ui.x );
	     }
	});

	$element.find('#zfSlider').slider({
	    value: 0,
	    min: 0,
	    max: 100,
		slide: function( event, ui ) {
	     	console.log('ui : ' + ui.x );
	    }
	});

});