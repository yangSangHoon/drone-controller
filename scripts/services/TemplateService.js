kindFramework.service('TemplateService', function( $rootScope, BroadcastAPI ){

	var _rootScope = $rootScope;
	var _broadcastAPI = BroadcastAPI;

	this.makeTemplate = function(n){
		var template = new Template({type:n});
		template.init();
	};

	this.makeCamerArea = function(){
		var template = new CameraArea();
		template.init();
	};

	var Template = function( obj ){
		$.extend( this, obj );
	};
	
	Template.prototype = {
		templateData : null,
		$div : null,
		$canvas : null,
		posList : [],
		wayPointGroup : null,
		context : null,
		type : null,
		aspectRatio : null,
		angle : { radians : 0, degrees : 0 }
	};
	
	Template.prototype.init = function(){

		this.makeContainer();
		this.makeOutLine();
		this.makeRotateBtn();
	     this.makeResizeBtn();
	     this.makeCommitBtn();
	     this.makeRemoveBtn();
		this.wayPointGroup = new WayPointGroup( {
			scope : this,
			type : this.type,
			moveFunc : this.move
		});
		this.$div.append( this.wayPointGroup.$div  );
		this.wayPointGroup.resize( this.$canvas.width(), this.$canvas.height() );

		this.dragEventSetting( this.wayPointGroup.$div );
	
	};

	//body에 새로 만든 탬플릿 div를 넣고 그안에 canvas를 넣는다
	Template.prototype.makeContainer = function(){
		this.$div = $('<div>');
		this.$canvas = $('<canvas>');
		this.context = this.$canvas[0].getContext("2d");
		$('#wrapper').append( this.$div );
		this.$div.append( this.$canvas );
		this.$canvas.attr({width:"150px", height:"150px;"});
		this.$div.css({ position:'absolute', zIndex : 100, left : $(window).width()/2, top : $(window).height()/2 });
	};

	Template.prototype.makeOutLine = function(){
	     this.context.beginPath();
	     //this.context.setLineDash([5,2]);
		
		this.context.fillStyle = "rgba(255, 255, 255, 0.79)";
	     this.context.fillRect(0,0,this.$canvas.width(),this.$canvas.height());

	     this.context.strokeStyle="#a2a09a";
		this.context.lineWidth=5;
		this.context.strokeRect(0,0,this.$canvas.width(),this.$canvas.height());
	};

	Template.prototype.dragEventSetting = function( handle ){
		handle.addClass("ui-widget-header ui-draggable-handle");
		var _this = this;
		var recoupLeft, recoupTop;
		this.$div.draggable({
			handle : handle,
			start: function (event, ui) {
				var left = parseInt($(this).css('left'),10);
				left = isNaN(left) ? 0 : left;
				var top = parseInt($(this).css('top'),10);
				top = isNaN(top) ? 0 : top;
				recoupLeft = left - ui.position.left;
				recoupTop = top - ui.position.top;
			},
			drag: function (event, ui) {
				ui.position.left += recoupLeft;
				ui.position.top += recoupTop;
			},
			stop : function( event, ui ){
				if( _this.rotatable !== undefined && _this.rotatable !== null ) _this.rotatable.reset( ui.position );	//드레그 후 offset의 position값 오류로 리셋
			}
		});
		
		/*this.$div.kindDraggable({
			handle : handle,
			start: function (event, ui) {
				var left = parseInt($(this).css('left'),10);
				left = isNaN(left) ? 0 : left;
				var top = parseInt($(this).css('top'),10);
				top = isNaN(top) ? 0 : top;
				recoupLeft = left - ui.position().left;
				recoupTop = top - ui.position().top;
			},
			drag: function (event, ui) {
				var tarLeft = ui.position().left + recoupLeft;
				var tarTop = ui.position().top + recoupTop;
				ui.css({left : tarLeft, top : tarTop });
			},
			stop : function( event, ui ){
				_this.rotatable.reset( ui.position() );	//드레그 후 offset의 position값 오류로 리셋
			}

		});*/
	};

	Template.prototype.makeResizeBtn = function(){
		var btn = this.getUI({bottom:'-15px', right:'-15px', background:'url(images/waypoint/temp_icon4.png)', width:'37px', height:'37px'});
		btn.attr('id', 'resizeHandler');
		btn.addClass('ui-resizable-handle ui-resizable-se');

		var _this = this;
		this.$div.resizable({
		    handles: {
		        'se': '#resizeHandler',
		    },
		    resize: function( event, ui ) {
		    		_this.resize( ui.size.width, ui.size.height );
		    		if( _this.rotatable !== undefined && _this.rotatable !== null ) _this.rotatable.reset( ui.position ); //리사이즈 후 offset의 position값 오류로 리셋
		    },
		    minHeight: 100,
      	    minWidth: 100,
      	    aspectRatio:  this.aspectRatio
		});
	};

	Template.prototype.makeRotateBtn = function(){
		var btn = this.getUI({top:'-15px', right:'-15px', background:'url(images/waypoint/temp_icon1.png)', width:'37px', height:'37px'});

		var _this = this;
		this.rotatable = this.$div.KindRotatable({
			handle : btn,
			rotate : function( event, ui ){
				_this.angle = { radians : ui.radians, degrees : ui.degrees };
				//_this.angle = ui.degrees
			}
		});
		/*this.rotatable = this.$div.rotatable({
			handle : btn,
			rotate : function( event, ui ){
				debugger;
				_this.angle = { radians : ui.angle.current, degrees : ui.angle.current * (180 / Math.PI) };
				//_this.angle = ui.degrees
			}
		})*/
	};

	Template.prototype.makeCommitBtn = function(){
		var btn = this.getUI({bottom:'-15px', left:'-15px', background:'url(images/waypoint/temp_icon2.png)', width:'37px', height:'37px'});
		var _this = this;
		btn.click(function(){
			_this.setPointMap();
		});
	};

	Template.prototype.makeRemoveBtn = function(){
		var btn = this.getUI({top:'-15px', left:'-15px', background:'url(images/waypoint/temp_icon3.png)', width:'37px', height:'37px'});
		var _this = this;
		btn.click(function(){
			_this.$div.remove();
		});
	};

	Template.prototype.resize = function( w, h ){
		this.$canvas.attr({width:w + "px", height: h + "px;"});
		this.makeOutLine();
		this.wayPointGroup.resize( w, h );
	};

	Template.prototype.getUI = function(css){
		var img = $('<div>');
		img.css( css );
		img.css({position : 'absolute', cursor : 'pointer', zIndex : '2000' });
		this.$div.append( img );
		return img;
	};

	Template.prototype.setPointMap = function(){
		var pointList = this.wayPointGroup.getPointDisAngleList();

		for( var i = 0; i<pointList.length; i++ ){
			var angle = ( pointList[i].angle + this.angle.degrees ) * 3.14/180;	//point의 각도와 컨테이너의 갇도를 넣애서 radian값으로 변경

			var pos = {
				x : Math.cos(angle) * pointList[i].distance,
				y : Math.sin(angle) * pointList[i].distance,
			};
			pos.x = pos.x + this.$div.originX;
			pos.y = pos.y + this.$div.originY;

			_rootScope.$broadcast( _broadcastAPI.SET_MARK_BY_PIXEL, pos );
		}
		this.$div.remove();
	};


	CameraArea = function( obj ){
		$.extend( this, obj );
		this.type =3;
		this.aspectRatio = 1;
	};

	CameraArea.prototype = new Template();
	CameraArea.prototype.constructor = CameraArea;
	CameraArea.prototype.init = function(){
		this.makeContainer();
		this.makeOutLine();
		this.makeResizeBtn();
	     this.makeCommitBtn();
	     this.makeRemoveBtn();
	     this.wayPointGroup = new CameraCircleArea( {
			scope : this,
			type : this.type,
			moveFunc : this.move
		});
	     this.$div.append( this.wayPointGroup.$div  );
	     this.wayPointGroup.resize( this.$canvas.width(), this.$canvas.height() );
	     this.dragEventSetting( this.wayPointGroup.$div );
	};
	CameraArea.prototype.setPointMap = function(){
		var offset = this.$div.offset();
		var data = {
			x : offset.left + this.$div.width()/2,
			y : offset.top + this.$div.height()/2,
			radius :  this.wayPointGroup.getRadiusMiter()
		};

		_rootScope.$broadcast( _broadcastAPI.SET_CAMERA_VIEW_AREA, data );

		this.$div.remove();
	};

	/*
	*
	*  WayPointGroup
	*
	*/
	WayPointGroup = function( obj ){
		$.extend( this, obj );
		this.init();
	};

	WayPointGroup.prototype = {
		$div  : null,
		pointList : [],
		type : null,
		padding : 30,
		pointItemList : [],
		isPoint : true,
		fillStyle : "rgba( 256, 256, 256, 0 )",
		strokeStyle : "#8aafec"
	};

	WayPointGroup.prototype.init = function(){
		this.pointItemList = [];
		this.makeContainer();
	};

	WayPointGroup.prototype.makeContainer = function(){
		this.$div = $('<div>');
		this.$canvas = $('<canvas>');
		this.context = this.$canvas[0].getContext("2d");
		this.$div.append( this.$canvas );
	};

	WayPointGroup.prototype.resize = function( w, h ){
		var gW = w - this.padding * 2;
		var gH = h - this.padding * 2;
		this.$canvas.attr({width: gW + "px", height: gH + "px;"});
		this.$div.css({ position:'absolute', zIndex : 100, left : this.padding, top : this.padding });
		
		if( this.type == 3 ){
			 this.makeCircleWayPoint();
		}else{
			this.pointList = this.getPointData( gW, gH );
			this.makeWayPoint( this.type );	
		}
		
	};

	//canvas에 circle waypoint그리기
	WayPointGroup.prototype.makeCircleWayPoint = function(){

		this.pointList = this.drawEllipse( this.context, 0, 0, this.$canvas.width(), this.$canvas.height() );
	};

	WayPointGroup.prototype.drawEllipse = function(ctx, x, y, w, h) {

		var kappa = 0.5522848,
		ox = (w / 2) * kappa, // control point offset horizontal
		oy = (h / 2) * kappa, // control point offset vertical
		xe = x + w,           // x-end
		ye = y + h,           // y-end
		xm = x + w / 2,       // x-middle
		ym = y + h / 2;  	  // y-middle

		ctx.beginPath();
		ctx.moveTo(x, ym);
		ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
		ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
		ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
		ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
		ctx.closePath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = this.strokeStyle;
		ctx.stroke();
		ctx.fillStyle = this.fillStyle;
		ctx.fill();
	
		return this.drawEllipseGetPointList( w, h, xm, ym );
	};

	WayPointGroup.prototype.drawEllipseGetPointList = function( w, h, xm, ym ){
		var pointList = [];
		var pointNum = 10;
		var center = {x:xm, y:ym};
		var angle = Math.floor( 360/pointNum );
		for( var i = 0; i<pointNum; i++ ){
			var r = i*angle * 3.14/180;
			var tx = Math.cos(r) * center.x + w / 2;
			var ty = Math.sin(r) * center.y + h / 2;
			pointList.push({ x : tx, y : ty });

			var itemPos = { x : tx - 8, y : ty - 8};

			if( this.pointItemList.length == i ){

				point = this.getPoint( i, itemPos );
				this.$div.append( point );	

				this.pointItemList[i] = point;
			}else{
				this.pointItemList[i].css({ left : itemPos.x + 'px', top :itemPos.y + 'px' } ) ;
			}
		}

		return pointList;
	};
	
	//canvas에 waypoint그리기
	WayPointGroup.prototype.makeWayPoint = function( type ){

		this.context.beginPath();
		for( var i = 0; i<this.pointList.length; i++ ){

			var tx = this.pointList[i].x;
			var ty = this.pointList[i].y;

			if( i === 0 ){
				this.context.moveTo( tx, ty);
			}else{
				this.context.lineTo( tx, ty );
			}

			var itemPos = { x : tx - 8, y : ty - 8};
			if( this.pointItemList.length == i ){

				point = this.getPoint( i, itemPos );
				this.$div.append( point );	

				this.pointItemList[i] = point;
			}else{
				this.pointItemList[i].css({ left : itemPos.x + 'px', top :itemPos.y + 'px' } ) ;
			}
		}

		if( type != 4 ){
			this.context.lineTo(  this.pointList[0].x,   this.pointList[0].y );	
		}
		
		this.context.strokeStyle = this.strokeStyle;
		this.context.lineWidth = 2;
		this.context.stroke();
	};

	//way point들의 각도와 중심검에서의 거리 배열 리턴
	WayPointGroup.prototype.getPointDisAngleList = function(){
		var list = [];
		for( var i = 0; i < this.pointList.length; i++ ){
			var data = this.getPointDisAngle( this.pointList[i] );
			list.push(data);
		}
		return list;
	};

	//way point의 각도와 중심검에서의 거리리턴
	WayPointGroup.prototype.getPointDisAngle = function( point ){
		var xa =  this.$canvas.width()/2 - point.x;
    		var ya =  this.$canvas.height()/2 - point.y;
		var angle = Math.atan2( ya, xa ) * (180 / Math.PI ) + 180;	//각도

		var xdf = point.x - this.$canvas.width()/2;
    		var ydf = point.y - this.$canvas.height()/2;
		var distance = Math.sqrt( Math.pow(Math.abs( xdf ), 2) + Math.pow( Math.abs( ydf ), 2) ); //중심점과 포인트와의 거리
		
		return { distance : distance,  angle : angle };
	};

	WayPointGroup.prototype.getPadding = function(){
		return this.padding;
	};


	WayPointGroup.prototype.getPointData = function( w, h ){

		var pointList = [];

		switch( this.type ){
			case 1 :
				pointList[0] = {x:0, y:0};
				pointList[1] = {x:w, y:0};
				pointList[2] = {x:w, y:h};
				pointList[3] = {x:0,y:h};	
			break;

			case 2 :
				pointList[0] = {x:w/2, y:0};
				pointList[1] = {x:w, y:h};
				pointList[2] = {x:0,y:h};	
			break;

			case 3 :
				pointList[0] = {x:w/2, y:0};
				pointList[1] = {x:w, y:h/2};
				pointList[2] = {x:w/2,y:h};	
				pointList[3] = {x:0,y:h/2};	
			break;

			case 4 :
				var pointNum = 10;
				var colNum = Math.floor(pointNum/2)-1;	//세로 라인수
				var colWid = w/colNum; //세로라인수로 나눈 한칸의 넓이
				console.log( "colNum : " + colNum );
				console.log( "colWid : " + colWid );
				for( var i = 0; i < pointNum; i++ ){
					var col = Math.floor(i/2);	//몇번째 라인인지
					console.log( "col : " + col );
					pointList[i] = {
						x : colWid * col,
						y : 0
					};	

					var checker = Math.floor(i/2)%2;	//몫 % 2
					if( i%2 == checker ){
						pointList[i].y = 0;	
					}else{
						pointList[i].y = h;
					}
				}
			break;

			default :
				pointList[0] = {x:0, y:0};
				pointList[1] = {x:w, y:0};
				pointList[2] = {x:w, y:h};
				pointList[3] = {x:0,y:h};	
			break;
		}
		return pointList;
	};
	
	//wayPoint의 각 point 리턴
	WayPointGroup.prototype.getPoint = function( index, pos ){
		var point = $('<div class="template_way_point">');
		point.text( index+1 );
		point.css({position : 'absolute', left : (pos.x)+'px', top : (pos.y)+'px' });
		return point;
	};
	
	//저장버튼 
	WayPointGroup.prototype.makeBtn = function(){
		var $img = $('<img>');
		$img.attr( 'src', 'images/btn_bottom_hide.png' );
		$img.css({position : 'absolute', left : '23px', top : '110px', cursor : 'pointer' });
		this.$div.append( $img );
		
		var _this = this;
		$img.click(function(){
			_this.setPointToMap();
		});
	};



	CameraCircleArea = function( obj ){
		$.extend( this, obj );
		this.init();
	};

	CameraCircleArea.prototype = new WayPointGroup();
	CameraCircleArea.prototype.fillStyle = "rgba( 79, 145, 255,  0.5 )";
	CameraCircleArea.prototype.strokeStyle = "rgba( 0, 0, 0,  0 )";
	CameraCircleArea.prototype.constructor = CameraCircleArea;
	CameraCircleArea.prototype.drawEllipseGetPointList = function( xm, ym ){
		console.log( xm, ym );
		//overrie : rogic clear
	};
	CameraCircleArea.prototype.getRadiusMiter = function(){
		return this.$canvas.width()/2;
	};

});