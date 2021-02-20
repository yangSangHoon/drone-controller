$.fn.KindRotatable = function(obj){

		var target = this,
		dragging = false,
		startingDegrees = 0,
		lastDegrees = 0,
		currentDegrees = 0;

		this.originX2 = target.offset().left;
		this.originY2 = target.offset().top;

		this.originX = target.offset().left + target.width() / 2;
		this.originY = target.offset().top + target.height() / 2;
		var _this = this;

		var _obj = obj;

		obj.handle.mousedown(function(e) {
			down(e);			
		});

		$(document).mouseup(function(e) {
			up(e);
		}).mousemove(function(e) {
			move(e);
		});

		obj.handle.bind('touchstart', function(e) {
			if( navigator.userAgent.match(/Android/i) ) {   // if you already work on Android system, you can        skip this step
	                event.preventDefault(); 
	           }
			down(e);			
		});
		$(document).bind('touchend', function(e) {
			up(e);
		});
		$(document).bind('touchmove', function(e) {
			move(e);
		});

		function move(e){
			var mouseX, mouseY, radians, degrees;
			if (!dragging) {
				return;
			}
			var event2 = e.originalEvent;
			if(  event2.touches != null ){
				mouseX = event2.touches[0].screenX;
				mouseY = event2.touches[0].screenY;
				
			}else{
				mouseX = e.pageX;
				mouseY = e.pageY;
			}
			radians = Math.atan2(mouseY - _this.originY, mouseX - _this.originX),
			degrees = radians * (180 / Math.PI) - startingDegrees + lastDegrees;

			currentDegrees = degrees;

			target.css('-webkit-transform', 'rotate(' + degrees + 'deg)');
			target.css('-ms-transform', 'rotate(' + degrees + 'deg)');
			target.css('transform', 'rotate(' + degrees + 'deg)');

			if( _obj.rotate != null ){
				_obj.rotate	( e, {
					radians : radians,
					degrees : degrees
				});
			};
		};

		function up(e){
			lastDegrees = currentDegrees;
			dragging = false;
			if( _obj.stop != null ){
				_obj.stop();
			};
		};

		function down(e){
			dragging = true;
			var event2 = e.originalEvent;
			if(  event2.touches != null ){
				mouseX = event2.touches[0].screenX;
				mouseY = event2.touches[0].screenY;
				
			}else{
				mouseX = e.pageX;
				mouseY = e.pageY;	
			}
			radians = Math.atan2(mouseY - _this.originY, mouseX - _this.originX),
			startingDegrees = radians * (180 / Math.PI);
		}



		
		this.reset = function(position){
			this.originX = position.left + target.width() / 2;
			this.originY = position.top + target.height() / 2;

			this.originX2 = target.offset().left;
			this.originY2 = target.offset().top;
		}

		return this;
	};