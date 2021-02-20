kindFramework.factory('DashBoad', function(){
	
	var DashBoad = function( $element, direction, data ){
		this.$element = $element;
		this.direction = direction || 1;
		if( data !== null ) $.extend( this, data );
		
		this.init();
	};
	
	DashBoad.prototype = {
		NUM : 25, //라인표시 갯수
		GAP : 5, //긴줄이표시되는 번째
	     DATA_GAP : 1, //간격하나당 값
	 	LINE_HEIGHT : 10, //라인간 간격
	 	MOVE_TEXT_VAL : 8,	//속도
	 	LINE_WIDTH : 2,	//라인굵기
		LONG_SIZE : 20, //라인길이
		SHORT_SIZE : 0, //라인길이
		START_X : 100, //캔버스 왼쪽 여유영역
		_dataList : [],
		_currentSpeed : 19,
		lineHeight : null,
		direction : 1,
		$element : null,
		$dashNumberArea : null,
		canvas : null,
		testN : 0,
	};
	
	DashBoad.prototype.init = function(){
		
		this.canvas = this.$element.find('canvas')[0];
		this.$dashNumberArea = this.$element.find('.txt_box');
		
		var textBoxTop = this.getTextBoxTop();
		this.$dashNumberArea.css('top', textBoxTop - this.$dashNumberArea.height()/2 );
		
		//var lineHeight = this.getLineHeight();
		//this.$element.find('.unit').css('top', lineHeight + 10 );

		this.reDraw();


		/*
		var _this = this;
		setInterval( function(){
			_this.testN += 1;
			_this.setValue( _this.testN.toFixed(2) );
		}, 250)*/
	};
	
	DashBoad.prototype.getTextBoxTop = function(){
		var tt = Math.floor(this.NUM/2)*this.LINE_HEIGHT;
		return tt;
	};
	
	DashBoad.prototype.getLineHeight = function(){
		var tt = this.NUM*this.LINE_HEIGHT;
		return tt;
	};
	
	DashBoad.prototype.getDataList = function(){
		
		var list = [];
		var obj = null;

		//중간값에서 전체라인표시줄의 반 * 간격당값을하여 최고 높은표시값구함
		var startValue = Math.floor( this._currentSpeed ) + Math.floor(this.NUM/2) * this.DATA_GAP; 
		
		var longLineChecker = this.DATA_GAP * this.GAP;	//긴줄체크값(ex 간격단 값이 10이고 5라인마다 긴라인이 나오는경우 10 * 5 )
		var defaultTy = Math.floor( this._currentSpeed ) % this.DATA_GAP;
		for( var i = 0; i < this.NUM; ++i ){
			obj = {};
			var value = startValue - i * this.DATA_GAP - defaultTy; //현재 값
			if( value % longLineChecker === 0){
				obj.txt = value < 0 ? 0 : value;
				obj.lineL = this.LONG_SIZE;
			}else{
				obj.lineL = this.SHORT_SIZE;
			}
			
			obj.ty = Math.floor(  i*this.LINE_HEIGHT + defaultTy * ( this.DATA_GAP / this.GAP / 2) );
			list.push( obj );
		}
	
		return list;
	};
	
	DashBoad.prototype.reDraw = function(){
		
		var dataList = this.getDataList();
		var c = this.canvas;

		var ctx = c.getContext("2d");
		ctx.clearRect(0, 0, c.width, c.height);
		ctx.beginPath();

		var screenSize = $(window).width();
		var rectWidth = screenSize * 0.06;
		if( rectWidth > 60 ) rectWidth = 60;
		var rectHeight = 250;
		if(this.direction == -1){
			ctx.rect(  this.START_X, 0, rectWidth, rectHeight);
		}else{
			ctx.rect(  this.START_X-rectWidth, 0, rectWidth, rectHeight);
		}
		ctx.fillStyle = "rgba( 256, 256, 256, 0.2 )";
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'black';
		ctx.stroke();

		ctx.font = "14px Arial";
		ctx.fillStyle = "#fff";


		for( var i = 0, len = dataList.length; i<len; ++i){
			var ty = dataList[i].ty;	//y좌표
			var lineL = dataList[i].lineL;	//라인길이
			var sx = (this.direction == -1) ? this.START_X : this.START_X;
			var ex = (this.direction == -1) ? this.START_X+lineL : this.START_X-lineL;
			ctx.moveTo(sx,ty);
			ctx.lineTo(ex,ty);
			ctx.strokeStyle = '#fff';
			ctx.lineWidth = this.LINE_WIDTH;
			ctx.stroke();
			
			if( dataList[i].txt !== undefined && dataList[i].txt !== null ){
				var textTx = (this.direction == -1) ? this.START_X+lineL + 10 : this.START_X - lineL - dataList[i].txt.toString().length * 10;
				ctx.fillText(dataList[i].txt, textTx, ty+5);
			}
		}
		
		this.$dashNumberArea.text( this._currentSpeed );
	};

	DashBoad.prototype.setValue = function( value ){
		var newValue = Math.floor( Number( value ) );
		if( newValue ==  this._currentSpeed ) return;
		this._currentSpeed = newValue;
		this.reDraw();
	};
	
	DashBoad.prototype.up = function(){
		
		/*
		*드론과의 통신로직추가예정
		*/
		this._currentSpeed += this.MOVE_TEXT_VAL;
		this.reDraw();
	};
	
	DashBoad.prototype.down = function(){
		
		/*
		*드론과의 통신로직추가예정
		*/
		
		if( this._currentSpeed > 0 ){
			this._currentSpeed -= this.MOVE_TEXT_VAL;
			this.reDraw();
		}
	};
	
	return DashBoad;
});