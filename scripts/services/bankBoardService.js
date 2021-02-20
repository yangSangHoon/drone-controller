kindFramework.service('BankBoardService', function(){

	this.canvas = null;
	this.arrow = null;
	this.ctx = null;
	this.size = 0;
	this.radius = 0;
	this.center = 0;
	this.centerAngle = 270;

	this.init = function($element){
		this.$element = $element;
		
		this.canvas = $element.find('canvas')[0];
		this.arrow = $element.find('.bank_icon');
		this.ctx = this.canvas.getContext("2d");
		this.size = $element.width();
		this.canvas.width = this.size;
		this.canvas.height = this.size;

		this.center = Math.floor(this.size/2);
		this.radius = this.center - 50;

		this.makeBoard();
		this.makeBoardAngleTxt();
		this.setBank(0);
	};

	this.makeBoard = function(){
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.beginPath();
		var sA = (Math.PI/180) * ( this.centerAngle - 60 );
		var eA = (Math.PI/180) * ( this.centerAngle + 60 );
		this.ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
		this.ctx.lineWidth = 3;
		//this.ctx.arc( this.center, this.center, this.radius, sA, eA, 0 );
		this.ctx.stroke();
		this.ctx.closePath();
	};

	//가장자리 숫자 밑 선 그리기
	this.makeBoardAngleTxt = function(){

		this.ctx.font = "14px Arial center";
		this.ctx.textAlign = 'center';
		this.ctx.fillStyle = "#fff";
		this.ctx.beginPath();
		this.ctx.lineWidth = 2.5;
		this.ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
		for( var i = -6; i < 7; i++ ){
			this.ctx.rotate(0);
			var ang = this.getDegree( i * 10 );
			var sPos = this.getPosition( ang, this.radius );
			var ePos = this.getPosition( ang, this.radius + 15 );
			var txtPos = this.getPosition( ang, this.radius + 25 );
			this.ctx.moveTo( sPos.x, sPos.y );
			this.ctx.lineTo( ePos.x, ePos.y );
			this.ctx.fillText( Math.abs(i)*10, txtPos.x, txtPos.y );
			this.ctx.stroke();
		}
		this.ctx.closePath();
	};

	//중심점으로부터의 거리와 각도로 좌표 구하기
	this.getPosition = function( degree, radius ){
		var tx = Math.cos( degree ) * radius + this.center;
		var ty = Math.sin( degree ) * radius + this.center;
		return { x : tx, y : ty };
	};

	this.getDegree = function( angle ){
		var degree = Math.PI/180 * ( this.centerAngle + angle );
		return degree;
	};

	this.setBank = function( angle ){
		
		/*var center = Math.PI/180 * this.centerAngle;
		var sPos = this.getPosition( center - angle - 0.047 , this.radius -15 );
		this.arrow.css({left: sPos.x + 'px', top: sPos.y + 'px'});
		this.arrow.css({ transform: "rotate(" + angle2 + "deg)" });*/
		
		var angle2 = angle * 180/Math.PI;
		$(this.canvas).css({ transform: "rotate(" + -angle2 + "deg)" });

	};

});