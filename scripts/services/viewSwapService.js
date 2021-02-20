kindFramework.service('ViewSwapService', function( $rootScope, BroadcastAPI ){
	
	var leftView = null;
	var mainView = null;
	var rightView = null;
	
	this.setLeftView = function(view){
		leftView = view;
		if( view.hasClass('camera_view') === false ) view.addClass('camera_view');
		this.goSub(view);
	};
	this.setMainView = function(view){
		mainView = view;
		view.removeClass('camera_view');
		view.removeClass('camera_view_map');
		this.goMain(view);
	};
	this.setRightView = function(view){
		rightView = view;
		if( view.hasClass('camera_view') === false ) view.addClass('camera_view');
		if( view.hasClass('camera_view_map') === false ) view.addClass('camera_view_map');
		this.goSub(view);
	};
	
	this.changeView = function(view){
		//return;
		if( view !== mainView ){
			if( view.hasClass('camera_view_map') === true ){	//오른쪽영역이면
				this.setRightView(mainView);
			}else{
				this.setLeftView(mainView);
			}
			this.setMainView(view);
		}
	};
	
	this.goMain = function(view){

		if( view.attr('id') == 'viewMap'){
			view.find("#dmContainer").css({ left:0, top:0, width : $(window).width(), height : $(window).height(), margin:0 });

		}else{
			var area = view.find('[name=videoArea]');
			if( area.length === 0 ) area = view;
			area.width( window.innerWidth + 150 );
			//area.height( window.innerHeight );
			//area.find("div").css({"width" : window.innerWidth });
			area.find(".kind-stream-canvas").css({"width" : "100%"});
		}
	};
	
	this.goSub = function(view){
		var area = view.find('[name=videoArea]');
		if( area === null || area.length === 0 ){
			area = view.find("#dmContainer");
			area.width( 217 );
			area.height( 190 );

			if( view.attr('id') == 'viewMap' ){
				$rootScope.$broadcast( BroadcastAPI.SET_MAP_RESET );
			}
				
		}else{
			area.width( 350 );
			area.find(".kind-stream-canvas").width(350);
			area.find("div").css({"width" : "100%" });
			area.css('height', 'auto' );
			/*if( window.plugins != null ){
				area.height( 190 );
			}	*/
		} 
		if( area.length === 0) area = view;
		
	};
	
});