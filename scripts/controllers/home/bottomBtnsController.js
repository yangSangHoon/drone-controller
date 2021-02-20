kindFramework.controller('bottomBtnsController', function( $rootScope, $scope, $element, $filter, SendProtocol, BroadcastAPI, SockManagerService, ControllerDataPool, DroneModel ){
	
	var isShow = true;
	var btn = $element.find('.btn');

	$.fn.toggleBtn = function(optionList){

		this.optionList = optionList;

		var _this = this;
		var index = 0;

		this.init = function(){
			this.eventSetting();
		};

		this.eventSetting = function(){

			this.click( function(){
				_this.optionList[index].clickFunc.call(SendProtocol);
			});
		};

		this.change = function(){
			if( index < this.optionList.length - 1 ){
				index++;
			}else{
				index = 0;
			}
			var data = this.optionList[index];
			this.text(data.txt);
			this.className(data.class);
		};

		this.changeState = function( nindex ){
			index = nindex;
			var data = this.optionList[index];
			this.text(data.txt);
			for( var i = 0; i<this.optionList.length; i++ ){
				this.removeClass( data.class );
			}
			this.addClass(data.class);	
		};

		this.init();
		return this;
	};

	var enginBtn = $("#btnEngin").toggleBtn([{ txt : $filter('translate')('ENGINE_START'), class:'enginStart', clickFunc : SendProtocol.startEngine },
												   { txt :$filter('translate')('ENGINE_STOP'), class:'enginStop', clickFunc : SendProtocol.stopEngine }]);

	var hoveringBtn = $("#btnHovering").toggleBtn([{ txt : $filter('translate')('HOVERING'), class:'hovering', clickFunc : SendProtocol.hovering },
												   { txt : $filter('translate')('RESUME'), class:'resume', clickFunc : SendProtocol.resume }]);

	var takeOffBtn = $("#btnTakeOff").toggleBtn([{ txt : $filter('translate')('TAKEOFF'), class:'takeoff', clickFunc : SendProtocol.takeOff },
												   { txt : $filter('translate')('LAND'), class:'land', clickFunc : SendProtocol.land }]);

	var controlReturnBtn = $("#btnControlReturn").toggleBtn([{ txt : $filter('translate')('CONTROL_PASS'), class:'controlReturn', clickFunc : SendProtocol.passOperatorControl },
												   { txt : $filter('translate')('CONTROL_GET'), class:'controlReturnGet', clickFunc : SendProtocol.getOperatorControl }]);

	function changeEnginBtn( value ){
		if( value == DroneModel.baseMode.ENGINE_START ){
			enginBtn.changeState(1);
		}else{
			enginBtn.changeState(0);
		}
	}
	function changeHoveringBtn( value ){
		if( value == DroneModel.moveMode.HOVERING ){
			hoveringBtn.changeState(1);
		}else{
			hoveringBtn.changeState(0);
		}
	}
	function changeTakeOffBtn( value ){
		if( value == DroneModel.takeOffMode.TAKEOFF ){
			takeOffBtn.changeState(1);
		}else{
			takeOffBtn.changeState(0);
		}
	}
	function changeControlReturnBtn( value ){
		if( value == DroneModel.operation.GET ){
			controlReturnBtn.changeState(1);
		}
	}
	
	$scope.$on( BroadcastAPI.ENGIN_STATE, function(e, value ){
		changeEnginBtn( value );	
	});

	$scope.$on( BroadcastAPI.HOVERING_STATE, function(e, value ){
		changeHoveringBtn( value );
	});

	

	$scope.$on( BroadcastAPI.TAKOFF_STATE, function(e, value ){
		changeTakeOffBtn( value );		
	});

	$scope.$on( BroadcastAPI.OPERATION_CONTROL_STATE, function(e, value ){
		changeControlReturnBtn( value );		
	});


	changeEnginBtn( DroneModel.saveBaseMode );
	changeHoveringBtn( DroneModel.saveMoveMode );
	changeTakeOffBtn( DroneModel.saveTakeOffMod );		
	
	function hide(){
		isShow = false;
		var tarB = $(".state_area").height() - $element.innerHeight();
		$element.stop().animate({'bottom': tarB + 'px'});
		btn.removeClass('on');
		btn.addClass('off');
	}
	
	function show(){
		isShow = true;
		var tarB = $(".state_area").height();
		$element.stop().animate({'bottom': tarB + 'px'});
		btn.removeClass('off');
		btn.addClass('on');
	}
	
	
	$scope.toggle = function(){
		if( isShow ){
			hide();
		}else{
			show();
		}
	};


	//////////////////////////////

	$scope.returnToLaunch = function(){
		SendProtocol.returnToLaunch();
	};


	var tarLeft = $element.innerWidth()/2;
	$element.css( "marginLeft", -tarLeft + "px" );

	$rootScope.$on( BroadcastAPI.BOTTOM_HIDE, hide );
	

	///////////////////////////////
/*


	$scope.land = function(){
		ControllerDataPool.send({
			chan7_raw : 2017
		});
	};

	$scope.takeoff = function(){
		ControllerDataPool.send({
			chan7_raw : 2016
		});
	}

	$scope.startEngine = function(){
		SendDataService.engineStart();
	}

	$scope.stopEngine = function(){
		SendDataService.engineStop();
	}

	$scope.hovering = function(){

	};

	$scope.resume = function(){

	};
*/
});