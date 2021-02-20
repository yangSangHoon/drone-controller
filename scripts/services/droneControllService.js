kindFramework.factory('DroneControll', function(){

	var DroneControll = function($element){
		this.$element = $element;
	};
	
	DroneControll.prototype = {
		tx : 0,
		ty : 0,
		speed : 5,
		$element : null,
		canvas : null,
		imgUrl : 'images/img_main.jpg'
	};
	
	DroneControll.prototype.init = function(){
		this.canvas = this.$element.find('canvas')[0];
		var _this = this;
		setInterval( function(){
			_this.reDraw();
		},500 );
	};
		
	DroneControll.prototype.moveGo = function(){
		this.ty+=this.speed;
		this.reDraw();
	};
	
	DroneControll.prototype.moveBack = function(){
		this.ty-=this.speed;
		this.reDraw();
	};
	
	DroneControll.prototype.moveLeft = function(){
		this.tx-=this.speed;
		this.reDraw();
	};
	
	DroneControll.prototype.moveRight = function(){
		this.tx+=this.speed;
		this.reDraw();
	};
	
	DroneControll.prototype.reDraw = function(){
		var context = this.canvas.getContext('2d');
		
		var imageObj = new Image();
		var _this = this;
		imageObj.onload = function() {
			context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
			context.drawImage(imageObj, _this.tx, _this.ty, _this.canvas.width, _this.canvas.height);
		};
		imageObj.src = this.imgUrl;
	};
	
	DroneControll.prototype.setImgUrl = function(imgUrl){
		this.imgUrl = imgUrl;
	};
	
	return DroneControll;
	
});