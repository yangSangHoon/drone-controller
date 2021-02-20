kindFramework.service( 'VerticalSpeedService', function(){

	this.canvas = null;
	this.ctx = null;
	this.cH = 250;
	this.cW = 13;
	this.stg = 21;
	this.saveValue = 0;

	this.init = function(obj){
		$.extend( this, obj );
		this.ctx = this.canvas.getContext("2d");
		this.canvas.setAttribute("width", this.cW +"px");

		this.changeValue(50);
	};

	this.drawArea = function(){
		this.ctx.beginPath();
		this.ctx.moveTo(0, this.stg);
		this.ctx.lineTo(this.cW, 0);
		this.ctx.lineTo(this.cW, this.cH);
		this.ctx.lineTo(0, this.cH - this.stg);
		this.ctx.lineTo(0, this.stg);
		this.ctx.strokeStyle = '#fff';
		this.ctx.lineWidth = 1;
		this.ctx.stroke();	
		/*this.ctx.fillStyle = "#fff";
		this.ctx.fill();*/
		this.ctx.closePath();
	};

	this.drawLine = function(){
		this.ctx.beginPath();
		var gap = 20;
		for( var i = 1; i<=11; i++ ){
			var ty = i * gap+5;
			this.ctx.moveTo(0, ty);
			if( i == 1 || i == 11 ){
				this.ctx.lineTo(this.cW, ty);	
			}else{
				this.ctx.lineTo(10, ty);
			}
			
			this.ctx.strokeStyle = '#fff';
			this.ctx.lineWidth = 1;
			this.ctx.stroke();	
		}
		this.ctx.closePath();	
	};

	this.changeValue = function(value ){

		if( value < -150 ) value = -150;
		if( value > 250 ) value = 250;
		
		if( this.saveValue == value ) return;
		this.saveValue = value;
		this.ctx.clearRect(0, 0, this.cW, this.cH );
		this.setValue( value );
		this.drawArea();
		this.drawLine();
	};

	this.setValue = function( value ){
		
		var middle = value/2 + 100;
		this.ctx.beginPath();
		this.ctx.moveTo(0, this.stg);
		this.ctx.lineTo(this.cW, 0);
		this.ctx.lineTo(this.cW, this.cH - middle );
		this.ctx.lineTo(0, this.cH - middle );
		this.ctx.lineTo(0, this.stg);
		this.ctx.fillStyle = "blue";
		this.ctx.fill();
		this.ctx.closePath();	

		this.ctx.beginPath();
		this.ctx.moveTo(0,  this.cH - middle);
		this.ctx.lineTo(this.cW,  this.cH - middle);
		this.ctx.lineTo(this.cW, this.cH );
		this.ctx.lineTo(0,  this.cH - this.stg);
		this.ctx.lineTo(0,  this.cH - middle);
		this.ctx.fillStyle = "red";
		this.ctx.fill();
		this.ctx.closePath();	

		
	};



});