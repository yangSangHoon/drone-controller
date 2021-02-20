kindFramework.factory( 'JoystickService' , function(){

	Joystick = function(){};

	Joystick.prototype = {
		handle : null,
		area : null,
		radius : null,
		range : {
			top: 100,
			bottom : 0,
			left : 0,
			right : 100
		},
		clickCenter : true,
		revert : true,
		wSize : 0,
		hSize : 0,
		defaultAreaPos : {},
		move : null, //return function
		stop : null //return function
	};

	Joystick.prototype.init = function( obj ){
		$.extend( this, obj );
		this.defaultSetting();
		this.eventSetting();
	};

	//반지름 및 핸들러 최초 위지 설정
	Joystick.prototype.defaultSetting = function(){
		this.radius = this.area.width()/2 - ( this.handle.width() / 2);
		this.handle.css({
			left : ( this.radius) + 'px',
			top : ( this.radius ) + 'px'
		});

		this.wSize = this.area.width() - this.handle.width();
		this.hSize = this.area.height() - this.handle.height();

		this.defaultAreaPos = this.area.position();
	};

	//핸들러 드레그 및 이벤트 설정
	Joystick.prototype.eventSetting = function(){
		var _this = this;
		//this.handle.draggable({
		var obj = {
			revert:this.revert,
			revertDuration : 100,
			start : function( e, ui, pos, offset ){

				var tarLeft = offset.pageX - _this.area.offset().left + _this.area.position().left - _this.area.width()/2;
				var tarTop = offset.pageY - _this.area.offset().top + _this.area.position().top - _this.area.height()/2;

				/*_this.area.css({ 
					left : tarLeft,
					top : tarTop
				});*/
			},
			drag : function( e, ui ){
			
				/*var customData = _this.getCustumData( ui.position().left, ui.position().top );
				ui.css({left : customData.left, top : customData.top });*/

				var customData = { left : ui.position().left, top: ui.position().top };
				//_this.setValue( customData );
				_this.setValueforPos( customData );
			},
			stop : function(e, ui){
				if( this.revert === true ){
					_this.setValueforPos( { left : ui.startPos.pageX, top : ui.startPos.pageY } );
				}else if( this.revert == "x" ){
					_this.setValueforPos( { left : ui.startPos.pageX, top : ui.position().top } );	
				}

				_this.area.css( _this.defaultAreaPos );
				if( _this.stop !== null ) _this.stop( e, ui );
				//_this.pointInit();
			},
			//radius : this.radius
			area : {
				minX : 0,
				minY : 0,
				maxX : this.wSize,
				maxY : this.hSize
			}
		};
		var agent = navigator.userAgent.toLowerCase();
		if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
           	this.handle.kindIEDraggable(obj);
        	}else{
        		this.handle.kindDraggable(obj);
        	}
		/*if(navigator.userAgent.match(/Windows/i) || navigator.userAgent.match(/Windows Phone/i) || navigator.userAgent.match(/iemobile/i) ){
           	this.handle.kindIEDraggable(obj);
        	}else{
        		this.handle.kindDraggable(obj);
        	}*/
	};

	Joystick.prototype.setValueforPos = function( data ){
		var yRange = this.range.top - this.range.bottom;
		var xRange = this.range.right - this.range.left;
		var padRage = this.radius*2;
		var yRate = ( padRage - data.top ) / padRage * yRange + this.range.bottom;
		var xRate = data.left / padRage * xRange + this.range.left;
		if( this.move !== null ) this.move({ x : xRate, y :yRate });
	};

	//핸들러의 중심점으로부터의 거리와 각도를 받아서 드론에 보낼 값 셋팅
	Joystick.prototype.setValue = function( data ){
		
		var disRate = data.distance/this.radius;	//거리 비율
		var angle = data.radians * 180 / 3.14 + 117;	//위의값을 27도 정도로 맞추기위한 값
		
		var funcList = [ this.up, this.upRight, this.right, this.bottomRright, this.bottom, this.bottomLeft, this.left, this.leftTop ];

		var angle2 = (angle + 360)%360;	//양수화

		this.pointInit();
		for( var i = 0; i < funcList.length; i++ ){
			if(  angle2 < 45 * (i+1) ){
				funcList[i].call( this, disRate );
				break;
			}
		}
	};

	//핸들러 사각형모양의 이동한계점 및 중심점으로 부터의 거리 및 각도 리턴
	/*Joystick.prototype.getCustumRectData = function( left, top ){

		if( left < 0 ){
			left = 0;	
		}else if( left > this.wSize ){
			left = this.wSize;	
		}
		
		if( top < 0 ){
			top = 0;	
		}else if( top > this.hSize ){
			top = this.hSize;	
		}

		return { left : left, top : top };
	}*/

	//핸들러 원모양의 이동한계점 및 중심점으로 부터의 거리 및 각도 리턴
	/*Joystick.prototype.getCustumData = function( left, top ){

		var tarLeft = left; 
		var tarTop = top;

		var result;
		var distance = Math.sqrt( Math.pow( left - this.radius, 2 ) + Math.pow( top - this.radius, 2 ) );
		var radians = Math.atan2( top - this.radius, left - this.radius );

		if( distance <= this.radius ){
			result = { left : tarLeft, top : tarTop };
		}else{
			distance = this.radius;
			result = {
				left : Math.cos( radians ) * this.radius + this.radius,
				top : Math.sin( radians ) * this.radius + this.radius
			}
		}

		result.distance = distance;
		result.radians = radians;

		return result;
	}*/

	return Joystick;

});
