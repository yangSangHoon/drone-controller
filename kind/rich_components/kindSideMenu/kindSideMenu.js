$.fn.kindSideMenu = function(){

	var subList = [];
	var currentMenu = null;

	this.init = function(){
		
		this.defaultSetting();
		this.hideAllSub();
		this.eventSetting();
	};

	this.defaultSetting = function(){
		var subList = this.find('.sub');
		for( var i = 0; i < subList.length; i++ ){
			var sub = $( subList[i] );
			sub.attr({ 'originH' : sub.height() });
			sub.css({overflow:'hidden'});
		}
	}

	this.eventSetting = function(){
		var _this = this;
		this.find('.kind_menu').click(function(e){
			_this.hideAllSub();
			if( currentMenu == this ){
				currentMenu = null;
			}else{
				currentMenu = this;
				_this.showSub( $(this).next() );
				_this.find('.kind_menu').removeClass('on');
				$(this).addClass('on');	
			}
		});
	};

	this.hideAllSub = function(){
		this.find('.sub').stop().animate({ height : 0 })
	}

	this.showSub = function( sub ){
		if( sub != null ){
			sub.show();
			//var originH = sub.attr('originH');
			var originH = sub.children(0).innerHeight();
			sub.css({height:0});
			sub.stop().animate({ height : originH})
		}
	}

	this.init();
	return this;
};