kindFramework.service('GyroscopeService', function(){
	
	this.$element = null;
	this.canvas = null;
	this.middleItem = null;
	this.ctx = null;
	this.yGap = 35;
	this.canvasWidth = 500;
	this.middleTy = 0;
	this.LINE_WIDTH = 2;
	this.lineLength = 100;

	this.init = function($element){
		this.$element = $element;
		this.canvas = $element.find('canvas')[0];
		this.middleItem = $element.find('.middle');
		this.defaultSetting();
		this.reDraw();
	};

	this.defaultSetting = function(){
		this.canvasWidth = $(window).width() * 0.3;
		this.lineLength = this.canvasWidth/3;
		this.yGap = this.canvasWidth/500 * 35;
	};
	
	this.makeBoard = function( bgColor, numArr, _y, _h, checker ){
		
		this.ctx.beginPath();

		this.ctx.font = "14px Arial center";
		this.ctx.textAlign = 'center';
		this.ctx.fillStyle = "#fff";
		
		
		for( var i = 0, len = numArr.length*2; i<len; ++i){
			var lineW = this.lineLength / 2;
			
			var ty = i * this.yGap + this.yGap + _y;
			var sx = this.canvasWidth/2 - lineW/2;
			if( i % 2 === checker ){
				lineW = this.lineLength;
				sx = this.canvasWidth/2 - lineW/2;
				var txt = numArr[Math.floor(i/2)];
				this.ctx.fillText( txt, sx - 20, ty+5);
				this.ctx.fillText( txt, sx + lineW + 20 , ty+5);
			}

			this.ctx.moveTo(sx,ty);
			this.ctx.lineTo(sx + lineW,ty);
			this.ctx.strokeStyle = '#fff';
			this.ctx.lineWidth = this.LINE_WIDTH;
			this.ctx.stroke();	

		}
		this.ctx.closePath();
	};
	
	this.reDraw = function(){
		var arr1 = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180];
		var arr2 = arr1.slice();
		arr2.reverse();
		var h = arr2.length * this.yGap * 2 + this.yGap;
		
		$(this.canvas).attr('height', h*2 );
		$(this.canvas).attr('width', this.canvasWidth );
		this.ctx = this.canvas.getContext("2d");
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		this.makeBoard("rgba(70, 96, 155, 0.7)", arr2, 0, h, 0 );
		this.makeBoard("rgba(150, 78, 32, 0.7)", arr1, h, h, 1 );
		this.makeMiddleLine(h);
		this.setPosition();
	};

	this.makeMiddleLine = function(_y){
		this.ctx.beginPath();
		this.ctx.moveTo(15,_y);
		this.ctx.lineTo( this.canvasWidth - 15,_y);
		this.ctx.strokeStyle = '#eda025';
		this.ctx.lineWidth = this.LINE_WIDTH;
		this.ctx.stroke();	
		
		this.ctx.fillStyle = "#eda025";
		this.ctx.fillText( 10, 0, _y + 5 );

		this.ctx.closePath();
	};
	
	this.setPosition = function(){
		var tx = (this.$element.width() - this.canvas.width)/2;
		var ty = (this.$element.height() - this.canvas.height)/2;
		$(this.canvas).css('margin-left', tx + 'px' );
		$(this.canvas).css('margin-top', ty + 'px' );

		this.middleTy = ty;
	};

	this.changeHorizen = function(angle){
		var angle2 = angle * 180/Math.PI;
		$(this.canvas).css({ transform: "rotate(" + -angle2 + "deg)" });
		//this.middleItem.css({ transform: "rotate(" + -angle2 + "deg)" });
	};
	
	this.changeArtificiel = function(artificiel){
		var degree = artificiel * 360/Math.PI;
		var rate = this.yGap*2/10;
		var tarY = this.middleTy + rate * degree;
		$(this.canvas).css('margin-top', tarY + 'px' );
	};
	
});