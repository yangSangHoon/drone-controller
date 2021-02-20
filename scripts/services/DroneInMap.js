kindFramework.factory('DroneInMap', function( MAP_SERVER, MapManager ){

	DroneInMap = function(){};
	DroneInMap.prototype = {
		container : null,
		drone : null,
		canvas : null,
		imageSize : 400,
		gap : 50,	//보이는 영역보다 캔버스가 더 커야 회전시에 공백이 안보이므로 캔버스보다 큰값
		C_NUM : 1000000,	//위경도값을 정수로 바꿔줄 곱해줄값
		centerLatLng : [],	//지도 중앙좌표 Array
		total_length : 0.0,
		distances : [],
		pointList : [],
		drawTotalWay : null,
		mapMovePos : {left:0, top:0},
		url : "", 
	};

	DroneInMap.prototype.init = function( obj ){

		$.extend( this, obj );
		this.makeDrone();
		this.cssSetting();
		this.con = $("<div>");
		this.con.css({"position" : "relative", "left" : 0, "top" : 0 });
		this.container.append( this.con );
		this.canvas = $("<canvas>");	//캔버스 생성
		this.wayPointCanvas = $("<canvas>");	//캔버스 생성
		this.wayPointCanvas.css({"position" : "absolute", "left" :0, "top" : 0 });
		this.con.append( this.canvas );
		this.con.append( this.wayPointCanvas );
		this.context = this.canvas[0].getContext('2d');
		this.wayPointContext = this.wayPointCanvas[0].getContext('2d');
		this.getMapData();
		this.eventSetting();
	};

	DroneInMap.prototype.makeDrone = function(){
		this.drone = $("<img>");
		this.drone.attr('src', '/images/icons/ico_uav.png' );
		this.container.append( this.drone );
		this.drone.css({
				'position' : 'absolute',
				'zIndex' : '10',
		});	
	};

	DroneInMap.prototype.eventSetting = function( ){
		var _this = this;
		this.con.draggable({
			drag : function( event, ui ){
				_this.mapMovePos = {left : ui.position.left, top:ui.position.top };
				_this.setDronePosition();
			}
		});
	};

	//캔버스 감싸고 있는 div( 회전객체 )와 드론에 대한 css적용
	DroneInMap.prototype.cssSetting = function( ){
		var parentWidth = this.container.parent().width();
		var parentHeight = this.container.parent().height();

		var cWidth = parentWidth + this.gap;
		var cHeight = parentHeight + this.gap;

		this.container.css({
			'position' : 'absolute',
			'width' : cWidth + 'px',
			'height' : cHeight + 'px',
			'left' : '50%',
			'top' : '50%',
			'marginLeft' : -(cWidth/2) + 'px',
			'marginTop' : -(cHeight/2) + 'px'
		});
	};

	DroneInMap.prototype.setDronePosition = function( position ){
		if( position === null ){
			position = this.saveDronePosition;
		}else{
			this.saveDronePosition = position;	
		}
		if( this.drone !== null ){
			
			if( position.length !== null ){
				var cLat = ( position[0] - this.sLat).toFixed(6);	//지도내의 lat값(상대좌표)
				var cLng =( position[1] - this.sLng).toFixed(6);	//지도내의 lng값(상대좌표)
				position = this.getTarPos( cLng, cLat );
			}
			
			var pos = {
				left : position.left + this.mapMovePos.left - this.drone.width()/2 - this.gap,
				top : position.top + this.mapMovePos.top - this.drone.height()/2 - this.gap
			};
			this.drone.css( pos );
		}
	};
	
	//서버에 저장되어있는 이미지 데이타를 가져온다
	DroneInMap.prototype.getMapData = function(){
		var _this = this;
		MapManager.getMap({
			success: function(result){
				var mapData = JSON.parse(result.data);
				_this.setCanvas( mapData );
				_this.mapSizeSetting( mapData );
			},
			error : function(){
			}
		});
		/*$.ajax({
			url: MAP_SERVER.ip + '/mapData',
			dataType: 'json',
			type : "POST",
			async: false,
			success: function(result){
				var mapData = JSON.parse(result.data);
				_this.setCanvas( mapData )
				_this.mapSizeSetting( mapData );
			},
			error : function(result){
			}
		});*/
	};

	//저장되어있던 지도 이미지들을 정보에 맞게 캔버스 사이즈를 조정하고 그린다
	DroneInMap.prototype.setCanvas = function(mapData){
		debugger;
		var mapDataList = mapData.mapList;

		var w = mapData.colN * this.imageSize;
		var h = mapData.rowN * this.imageSize;

		this.canvas.attr({ 'width' : w + 'px', 'height' : h +'px',  });
		this.wayPointCanvas.attr({ 'width' : w + 'px', 'height' : h +'px',  });

		var _this = this;
		var length = mapDataList.length;
		
		function loadImage( i ){
			var data = mapDataList[i];
			var url  = data.url;

			var imageObj = new Image();
			imageObj.onload = function() {
				_this.context.drawImage( imageObj, data.position.x * _this.imageSize, data.position.y * _this.imageSize );	
				if( i == length-1){
					_this.setWayPointData( _this.latLngList );	
					//_this.setWayPointData( [_this.saveAA]);	
				}	
			};
			imageObj.src = url;
		}
		
		for( var i =0 ; i<length; i++ ){
			loadImage(i);
		}

		//this.setWayPointData(  this.latLngList );	
	};

	//드론의 위치를 계산하기 위한 맵위 좌상단 위경도와 우하단 위경도 맵의 사이즈등을 저장한다.
	DroneInMap.prototype.mapSizeSetting = function( mapData ){
		debugger;
		this.sLat = mapData.eLatLng.lat;
		this.sLng = mapData.sLatLng.lng;

		this.latSize = Number(mapData.sLatLng.lat - mapData.eLatLng.lat).toFixed(6)  * this.C_NUM;	//위도
		this.lngSize = Number(mapData.eLatLng.lng - mapData.sLatLng.lng).toFixed(6) * this.C_NUM;	//경도
		
		this.latPixelSIze = mapData.colN * this.imageSize - this.imageSize;	//맵의 중심점기준이므로 imageSize를 감산한다
		this.lngPixelSIze = mapData.rowN * this.imageSize - this.imageSize;

		this.currentLatLng = mapData.currentLatLng;

		//this.changeLatLng( this.centerLatLng ); //최초 지도 센터
	};

	//publilc
	//현재 위경도를 저장해 놓은 위경도와 맵의 사이즈의 비율에 맞게 계산하여 캔버스의 좌표를 조정한다
	DroneInMap.prototype.changeLatLng = function( latLng ){
		var cLat = (latLng[0] - this.sLat).toFixed(6);	//지도내의 lat값(상대좌표)
		var cLng = (latLng[1] - this.sLng).toFixed(6);	//지도내의 lng값(상대좌표)

		this.saveAA = { x: latLng[0], y : latLng[1] }; //test

		var wCenter = (  this.container.width() - this.canvas.width() ) / 2;
		var hCenter = ( $(window).height() - this.canvas.height() ) / 2;
		var tarTop = 0;
		var tarLeft = 0;
		var mLeft = 0;
		var mTop = 0;
		//위경도로부터 좌표구하기
		if( this.types ){
			tarTop = this.latPixelSIze - ( this.latPixelSIze * cLat * this.C_NUM ) / this.latSize + this.gap - 10 ;	//10오차가 있음
			tarLeft = ( this.lngPixelSIze * cLng * this.C_NUM ) / this.lngSize + this.gap;
			tarTop *= -1;
			tarLeft *= -1;
		}else{
			var tarPos = this.getTarPos( cLng, cLat );
			mLeft = tarPos.left;
			mTop = tarPos.top;

			//중심좌표와 지도 중심좌표와의 gap
			var gapLeft  = this.canvas.width()/2 - mLeft;
			var gapTop  = this.canvas.height()/2 - mTop;
			
			tarLeft = wCenter + gapLeft;
			tarTop = hCenter + gapTop;	

		}
		this.con.css({'left' : tarLeft + 'px',  'top' : tarTop + 'px'} );
		//this.wayPointCanvas.css({'left' : tarLeft + 'px',  'top' : tarTop + 'px'} );

		this.mapMovePos = {left : tarLeft, top : tarTop};
		this.setDronePosition({left : mLeft, top : mTop});
	};
	
	//저장해 놓은 waypoint화면에 그리기
	DroneInMap.prototype.setWayPointData = function( latLngList ){
		this.clearMarker();

		this.wayPointContext.beginPath();
		if( latLngList === null )  return;
		var transPosList = [];
		for( var i = 0; i < latLngList.length; i++ ){
			
			var lat = latLngList[i].x;
			var lng = latLngList[i].y;
			var cLat = (lat - this.sLat).toFixed(6);	//지도내의 lat값(상대좌표)
			var cLng = (lng- this.sLng).toFixed(6);	//지도내의 lng값(상대좌표)
			var tarPos = this.getTarPos( cLng, cLat );
			var tarLeft = tarPos.left;
			var tarTop = tarPos.top;

			if( i === 0 ){
				this.wayPointContext.moveTo( tarLeft, tarTop);
				this.setDronePosition( tarPos );
			}else{
				this.wayPointContext.lineTo( tarLeft, tarTop );
			}
			this.wayPointContext.setLineDash([8, 8]);
			this.wayPointContext.strokeStyle = '#473c73';
			this.wayPointContext.lineWidth = 4;
			this.wayPointContext.stroke();

			var obj = {};
			obj.position = { x : tarLeft-this.gap, y: tarTop-this.gap };
			obj.dataObj = {
				height : latLngList[i].z,
				state : latLngList[i].command
			};
			transPosList.push(  obj );
		}

		this.createMarker( transPosList );
		
	};

	DroneInMap.prototype.createMarker = function(transPosList) {
		this.pointList = [];
		for( var i = 0; i < transPosList.length; i++ ){
			var point = new PointItemOff({
				index : i+1,
				position : transPosList[i].position,
				dataObj : transPosList[i].dataObj || {},
				wayPointContext :  this.wayPointContext
			});	      	
			this.pointList.push( point );
     		}

     		this.getDistanceOfPath( this.pointList );
    };

	DroneInMap.prototype.getDistanceOfPath = function( pointList ){
		var dist = 0.0;
		this.total_length = 0;

		for(var i = 0; i < pointList.length - 1; i++) {
			dist = this.getDistance( pointList[i].position, pointList[i+1].position );
			pointList[i].dist = dist;
			this.total_length += dist;
		}
		if( this.drawTotalWay !== null ) this.drawTotalWay( this.total_length, pointList );
     };

      DroneInMap.prototype.getMoveDroneRate = function( missionNum, pos ){

     		if( this.pointList.length-1 < missionNum ) return;

     		var cLat = (pos[0] - this.sLat).toFixed(6);	//지도내의 lat값(상대좌표)
		var cLng = (pos[1]- this.sLng).toFixed(6);	//지도내의 lng값(상대좌표)

		var tarPos = this.getTarPos( cLng, cLat );
     		var myLatlng = {x : tarPos.left, y : tarPos.top };
     		var currentNum = missionNum-1;
     		//현좌표와 현재 미션좌표와의 거리
     		var uavDist = this.getDistance( this.pointList[currentNum].position, myLatlng );
     		var currentDist = 0;
     		var totalDist = 0;
     		var dist = 0;
     		for(var i = 0; i < this.pointList.length-1; i++) {
			dist = this.getDistance( this.pointList[i].position, this.pointList[i+1].position );
			if( i < currentNum ){	//현재 미션번호까지 거리 저장
				currentDist += dist;
			}
			totalDist += dist;	//전체 거리 저장
		}

		var sumDist = uavDist + currentDist; //시작점부터 현위치까지의 거리
		var distRate = sumDist / totalDist * 100;  //이동거리 비율

		return distRate;
     };

     DroneInMap.prototype.getDistance = function(pos1, pos2 ){
      	return Math.sqrt( Math.pow( pos1.x - pos2.x, 2 ) + Math.pow( pos1.y - pos2.y, 2 ) );
     };

	DroneInMap.prototype.clearMarker = function(){
		this.wayPointContext.clearRect(0, 0, this.wayPointCanvas.width(), this.wayPointCanvas.height() );
	};

	DroneInMap.prototype.setFunc = function( funcObj ){
		this.drawTotalWay = funcObj.drawTotalWay;
		this.updateWayPoint = funcObj.updateWayPoint;
	};

	/*DroneInMap.prototype.getTarPos2 = function( cLng, cLat ){
		var tarTop = this.latPixelSIze - ( this.latPixelSIze * cLat * this.C_NUM ) / this.latSize + this.gap - 10;	//10오차가 있음
		var tarLeft = ( this.lngPixelSIze * cLng * this.C_NUM ) / this.lngSize + this.gap;
		return { left : tarLeft, top : tarTop };
	}*/

	DroneInMap.prototype.getTarPos = function( cLng, cLat ){
		var tarLeft = ( this.lngPixelSIze * cLng * this.C_NUM ) / this.lngSize + this.gap + this.imageSize/2;
		var tarTop = this.latPixelSIze - ( this.latPixelSIze * cLat * this.C_NUM ) / this.latSize + this.gap + this.imageSize/2;

		return { left : tarLeft, top : tarTop };
	};

	var testRotate = 0;//테스트 값


	//publilc
	DroneInMap.prototype.changeHead = function( head ){

		//테스트 실제 head값의 각도 계산이 필요함
		if( testRotate < 360 ){
			testRotate+=5*head;
		}else{
			testRotate = 0;
		}
		this.container.css('rotate', testRotate );
	};

	DroneInMap.prototype.setClickListener = function(){
		
	};

	/**
	*	PointItemOff
	*/
	PointItemOff = function( obj ){
		$.extend(this, obj );
		this.init();
	};
	
	PointItemOff.prototype.index = 0;
	PointItemOff.prototype.position = null;
	PointItemOff.prototype.map = null;
	PointItemOff.prototype.point = null;
	PointItemOff.prototype.overlay = null;
	PointItemOff.prototype.dataObj = {};
	PointItemOff.prototype.clickListener = null;
	PointItemOff.prototype.updateWayPoint = null;
	
	PointItemOff.prototype.init = function(){
		this.defaultDataSetting();
		this.makeItem();
	};

	PointItemOff.prototype.defaultDataSetting = function(){
		this.dataObj.speed = 10;
		this.dataObj.index = this.index;
	};

	PointItemOff.prototype.makeItem = function(){

		var imageObj = new Image();

		var _this = this;
		imageObj.onload = function() {
			_this.wayPointContext.drawImage( imageObj, _this.position.x-29, _this.position.y - 68);
			_this.wayPointContext.font = "21px Arial";
			_this.wayPointContext.fillStyle = "#0050d3";
		     _this.wayPointContext.textAlign = 'center';
	      	_this.wayPointContext.fillText( _this.index, _this.position.x, _this.position.y -35 );
		};
		imageObj.src = 'images/bg/bg_waypoint.png';
	};
	

	PointItemOff.prototype.on = function(){
		this.point.setIcon( "images/bg/bg_waypoint_on.png");
	};
	PointItemOff.prototype.off = function(){
		this.point.setIcon( "images/bg/bg_waypoint.png");
	};

	PointItemOff.prototype.getData = function(){

		var data = {
			index : this.index,
			x : this.position.G.toFixed(7),
			y : this.position.K.toFixed(7),
			z : this.dataObj.height || 1,
			command : this.dataObj.state || 16,
			current : 0,
			dataObj : this.dataObj,
			autocontinue : 1,
			param1 : 0,
			param2 : 0,
			param3 : 0,
			param4 : 0
		};
		return data;
	};

	return DroneInMap;
});























