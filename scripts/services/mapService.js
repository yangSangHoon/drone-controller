kindFramework.service('MapService', function($timeout, ModalService, TemplateService, PopupManager, SendProtocol , DroneModel){
	
	var route = null,
		map = null,
    	mapClickListener = null,
		pointList = null,
		overlay = null,
		//pointType = 'auto',
		pointType = 'waypoint',
		viewPointList = null,
		iconImg = null,
		iconOnImg = null,
		isHomeCheck = false;

	this.uavImg = "";
	this.gap = 150;
	this.drawTotalWay = null;
	this.drone =  null;
	this.drone2 =  null;
	this.settingModal =  null;
	this.selectedPoint =  null;
	
	this.setFunc = function( funcObj ){
		this.drawTotalWay = funcObj.drawTotalWay;
		this.updateWayPoint = funcObj.updateWayPoint;
	};
		
	this.init = function( obj ){
		this.movePliyArr = [];
		this.container = obj.container;
		this.drone2 = obj.drone;
		if( obj.gap !== undefined && obj.gap !== null ) this.gap = obj.gap;

		 this.uavImg = ( obj.uavImg !== undefined && obj.uavImg !== null ) ? obj.uavImg :  '/images/icons/ico_uav.png';

		if( obj.iconImg !== undefined && obj.iconImg !== null ) iconImg = obj.iconImg;
		if( obj.iconOnImg !== undefined && obj.iconOnImg !== null ) iconOnImg = obj.iconOnImg;

		isHomeCheck = obj.isHome;
		if( isHomeCheck ){
			this.cssSetting();
		}else{
			this.container[0].style.width = "100%";
			this.container[0].style.height = "100%";	
			iconImg = null;
			iconOnImg = null;
		}
		map = new google.maps.Map( this.container[0] ,{});

		var cordi = [37.403928, 127.109649];
		var zoom = 17;

		var mapOptions = {
			center : new google.maps.LatLng(cordi[0],cordi[1]),
			zoom : zoom,
			mapTypeId : google.maps.MapTypeId.SATELLITE,
			overviewMapControl: false,
			mapTypeControl: false,
			panControl: false,
			scaleControl: false,
			streetViewControl: false,
			zoomControl: false
		};

		$timeout(function(){
			google.maps.event.trigger(map, "resize");
		});
		
		map.setOptions(mapOptions);

		this.reset();
		this.eventSetting();
	};

	this.reset = function(){
		pointList = [];
		viewPointList = [];

		this.saveBeforePosition = null;
		
		if( route !== undefined && route !== null ) route.setMap( null );
		if( this.lastLine !== undefined && this.lastLine !== null ) this.lastLine.setMap( null );
		this.removeMoveLine();

		overlay = new google.maps.OverlayView();
		overlay.draw = function() {};
		overlay.setMap(map);

		var lineSymbol = {
			path: 'M 0,-0.5 0,1',
			strokeOpacity: 1,
			scale: 4,
			strokeColor: '#00deff',
			///strokeColor: '#473c73',
		};
		route = new google.maps.Polyline( {
			strokeOpacity: 0,
			icons: [{
				icon: lineSymbol,
				offset: '0',
				repeat: '20px'
			}],
			map: map
		});            
		route.setMap(map);	

		var lineSymbol2 = {
		  path: 'M 0,-0.5 0,1',
		  strokeOpacity: 1,
		  scale: 4,
		  strokeColor: '#04ff39',
		};
		this.lastLine = new google.maps.Polyline({
			map : map,
			strokeOpacity: 0,
			icons: [{
				icon: lineSymbol2,
				offset: '0',
				repeat: '20px'
			}],
		});

		this.movePolyline = new google.maps.Polyline({
			map : map,
			strokeColor:"red",
			strokeOpacity:0.8,
			strokeWeight:4
		});	
	};

	this.removeMoveLine = function(){
		for( var i = 0; i<this.movePliyArr.length; i++ ){
			this.movePliyArr[i].setMap( null );
		}
		this.movePliyArr = [];

		if( this.movePolyline !== undefined && this.movePolyline !== null ) this.movePolyline.setMap( null );
	};

	this.eventSetting = function(){
		var _this = this;
		google.maps.event.addListener(map, 'center_changed', function() { 
			_this.setSettingPopLocation();
		});
	};

	this.setSettingPopLocation = function(){

		var proj = overlay.getProjection();
		if( proj === undefined || proj === null ) return;

		if( this.selectedPoint !== undefined && this.selectedPoint !== null ){
			var pos = proj.fromLatLngToContainerPixel( this.selectedPoint.point.getPosition());
			this.settingPop.css({ left: pos.x +30, top: pos.y - 230 });	
		}
		
		if( this.drone2 !== null ){
			var pos2 = this.drone2.position;
			if( typeof pos2 == 'function' ) pos2 = map.getCenter();
			var dronPos = proj.fromLatLngToContainerPixel( pos2 );
			this.drone2.css({ left: dronPos.x -this.gap/2, top: dronPos.y -this.gap/2 });	
			this.drone2.position = pos2;
		}
	};

	//캔버스 감싸고 있는 div( 회전객체 )와 드론에 대한 css적용
	this.cssSetting = function( ){
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

	this.offDrag = function(){
		map.setOptions({draggable: false, scrollwheel :false });
	};

	this.offZoom = function(){

	};

	this.setDrone = function(){
		/*if( this.drone != null ){
			this.drone.setMap(null);
		}

		this.drone = new google.maps.Marker({
			position: map.getCenter(),
			map: map,
			zIndex:100,
			optimized : false,
			icon: this.uavImg,
			rotation : 45
		});*/
		//test
		this.drone2.css({left : "50%", top : "50%", display:'block'});
		this.drone2.position = map.getCenter();
		
		//this.settingPop.css({ left: pos.x +30, top: pos.y - 230 });
	};

	this.movePolyline = null;
	this.setDronePosition = function( position ){
		if( this.drone !== null || this.drone2 !== null ){
			if( position === null ){	//position값이 없으면 지도 중앙으로 드론을 생성
				this.setDrone();
			}else{
				if( position.length !== null ){
					position = new google.maps.LatLng(parseFloat(position[0]),parseFloat(position[1]));	
				}
				this.drawMoveLine( position );
				//this.drone.setPosition(position);			

				//test
				this.changeDronePosition( position );
			}
		}
	};

	this.changeDronePosition = function( position ){
		var proj = overlay.getProjection();
		if( proj !== undefined && proj !== null ){
			var pos = proj.fromLatLngToContainerPixel( position );
			this.drone2.css({ left: Math.floor( pos.x - this.gap/2 ), top : Math.floor( pos.y - this.gap/2 ) });
			this.drone2.position = position;
		}
	};

	//이미 지나온길 그리기
	this.beforeDrawMovedLine = function(missionNum){
		if( pointList.length > 0 && missionNum > 0 ){
			var moveLineArr = [];
			moveLineArr.push( pointList[0].position );
			for( var i = 1; i < missionNum; i++ ){
				if( i < pointList.length ){
					moveLineArr.push( pointList[i].position );	
				}
			}
			moveLineArr.push( this.drone2.position );
			this.movePolyline.setPath( moveLineArr );
		}
	};

	//화면 열리고 지나가는길 그리기
	this.saveBeforePosition = null;
	this.movePliyArr = [];
	this.drawMoveLine = function(position){
		if( this.saveBeforePosition !== null && this.saveBeforePosition.lat() != position.lat() ){
			var currentMovePolyline = new google.maps.Polyline({
				map : map,
				strokeColor:"red",
				strokeOpacity:0.8,
				strokeWeight:4,
				zIndex:10,
			});
			this.movePliyArr.push( currentMovePolyline );
			currentMovePolyline.setPath( [ this.saveBeforePosition, position ]);
			//this.droneHeadRotate( this.saveBeforePosition, position );			
		}
		this.saveBeforePosition = position;
	};

	this.droneHeadRotate = function( p1, p2 ){
		var proj = overlay.getProjection();
		if( proj !== undefined && proj !== null && DroneModel.speed > 0.4 ){
	 		var pos = proj.fromLatLngToContainerPixel( p1 );
			var tartPos = proj.fromLatLngToContainerPixel( p2 );
			var dx = pos.x - tartPos.x;
			var dy = pos.y - tartPos.y;
			var rad= Math.atan2(dx, dy);
			var degree = (rad*180)/Math.PI;
			this.drone2.css({ transform: "rotate(" + -degree + "deg)"  });
		}
	};

	this.setDroneHeadRotate = function( degree ){
		this.drone2.css({ transform: "rotate(" + Math.floor( degree ) + "deg)"  });
	};

	/*this.drawMoveLine = function(position){
		if( pointList.length > 0 && DroneModel.currentMissionNum > 0 ){
			var moveLineArr = [];
			moveLineArr.push( pointList[0].position )
			for( var i = 1; i<DroneModel.currentMissionNum; i++ ){
				if( i < pointList.length ){
					moveLineArr.push( pointList[i].position )	
				}
			}
			//moveLineArr.push( this.getDroneWayPosition( position ) );
			moveLineArr.push( position );
			this.movePolyline.setPath( moveLineArr );
		}
	}*/

	this.getDroneWayPosition = function( cp ){

		var newPos = {};
		var cn = DroneModel.currentMissionNum;
		var p1 = pointList[ cn - 1 ].position;
		var p2 = null;
		if( cn < pointList.length ){
			p2 = pointList[ cn ].position;
		}else{
			p2 = pointList[ 0 ].position;
		}
		var distance = Math.sqrt( Math.pow( p1.lat() - cp.lat(), 2 ) + Math.pow( p1.lng() - cp.lng(), 2 ) );

		var dx = p2.lat() - p1.lat();
	   	var dy = p2.lng() - p1.lng();
		var rad = Math.atan2(dy, dx);
		
		var lat = p1.lat() + distance * Math.cos( rad );
		var lng = p1.lng() + distance * Math.sin( rad );

		newPos = new google.maps.LatLng( parseFloat(lat), parseFloat(lng) );
		//this.pointPosCheck( newPos );
		return newPos;
	};

	this.pointPosCheck = function(pos){
		for( var i = 0; i < pointList.length; i++ ){
			var position = pointList[i].position;
			var latGap = Math.abs( pos.lat() - position.lat() );
			var lngGap = Math.abs( pos.lng() - position.lng() );
			/*console.log( "latGap : " + latGap );
			console.log( "lngGap : " + lngGap );*/
			if( latGap < 0.00007 && lngGap < 0.00007 ){
				this.bcMissionNum = i;
				console.log( this.bcMissionNum );
				break;
			}
		}
	};

	

     this.clickEvent = function (event){
     		if( pointType == "auto" ){
     			this.clearMarker();

     			this.makeStartPoint();

	     		this.addRoute( {
	     			position : event.latLng,
	     			icon : "images/icons/bg_onepoint.png",
	     			iconOn : "images/icons/bg_onepoint.png",
	     			isAutoPop : true
	     		});

	     	}else if( pointType === "waypoint" ){
	     		if( pointList.length === 0 ){
	     			this.makeStartPoint();
			}
	     		this.addRoute( {position : event.latLng });
	     	}else{
	     		this.addCameraPoint( event.latLng );
	     	}
     };


    this.addRoute = function(data){
		var path = route.getPath();
		path.push( data.position );
		var _this = this;
		var pointInitData = {
			index : ( pointType == "waypoint" && pointList.length > 0 ) ? pointList.length : "",
			position : data.position,
			map : map,
			overlay : overlay,
			dataObj : data.dataObj || {},
			icon : data.icon,
			iconOn : data.iconOn,
			updateWayPoint : function( dataObj ){
				if( _this.updateWayPoint !== undefined && _this.updateWayPoint !== null && _this.settingModal !== undefined && _this.settingModal !== null ){
					_this.settingModal.controller.setData( dataObj );
					_this.updateWayPoint( dataObj );
				}
			},
			clickListener : function( point ){
				_this.pocusChange( point );
			},
			deleteListener : function( index ){
				_this.redrawPointPoliyLine( index );
			},
			dragendListener : function(){
				_this.redrawPointPoliyLine();
			},
		};

		if( data.isAutoPop === true ){
			pointInitData.makeAutoPop = function( point ){
				_this.makeAutoPopup( point );
			};
		}

		var point = new PointItem( pointInitData );

		pointList.push( point );

		this.drawLastLine(point);
		this.getDistanceOfPath( pointList );
     };

     this.lastLine = null;
     this.drawLastLine = function(point){
     		if( pointList.length > 2 ){
     			this.lastLine.setPath( [point.position, pointList[0].position ] );
     		}
     };

     //현재 경로 업데이트 구현 필요
     this.addPath = function(position){
		var path = route.getPath();
		path.push(new google.maps.LatLng(position.G, position.K ));
		route.setPath(path);     	
     };

     this.totalClickPoint = function( index ){
     		this.pocusChange( pointList[index] );
     };

     this.makeAutoPopup = function(point){

		this.pocusOff();	     	

		//point.on();
		//this.changeLatLng([ point.position.G, point.position.K ]);

		ModalService.allClose('settingPop');
		//ModalService.allClose();
		
		var _this = this;
		ModalService.showPopup({
			templateUrl: 'views/popup/autoPop.html',
			controller: 'pointSettingController',
			id : 'settingPop'
		}).then(function(modal) {

			_this.selectedPoint = point;
			_this.settingModal = modal;
			_this.settingPop = modal.element;
			_this.setSettingPopLocation();
			//팝업으로 데이타 전송
			modal.controller.setData( point.dataObj, point );
			//팝업에서 데이타 받기
			modal.close.then(function(result) {
				if( result !== null ){
					var position = point.point.position;
					SendProtocol.waypoint({
						lat : position.lat(),
						lng : position.lng(),
						alt : result.height
					});
				}
				_this.pocusOff();
			});
		});
     };

     this.pocusChange = function(point){

		this.pocusOff();	     	

		point.on();
		this.changeLatLng([ point.position.G, point.position.K ]);

		ModalService.allClose('settingPop');
		//ModalService.allClose();
		
		var _this = this;
		ModalService.showPopup({
			templateUrl: 'views/popup/pointSetting.html',
			controller: 'pointSettingController',
			id : 'settingPop'
		}).then(function(modal) {

			_this.selectedPoint = point;
			_this.settingPop = modal.element;
			_this.setSettingPopLocation();
			//팝업으로 데이타 전송
			modal.controller.setData( point.dataObj, point );
			//팝업에서 데이타 받기
			modal.close.then(function(result) {
				if( result !== undefined && result !== null ){
					if( result.isDelete ){
						PopupManager.confirm("삭제하시겠습니까?", function(result){
							if( result === true ){
								point.deleteListener( point.index );	
							}
						});
					}else{
						$.extend( point.dataObj, result );
						point.updateWayPoint( point.dataObj );	
					}
				}

				_this.pocusOff();
			});
		});
     };

     this.pocusOff = function(){
		for( var i = 0; i<pointList.length; i++ ){
			pointList[i].off();
		}
     };
	
     this.getDistanceOfPath = function( pointList ){
     		if( this.drawTotalWay === null ) return;

		var dist = 0.0;
		this.total_length = 0.0;
		this.distances = [];

		for(var i = 0; i < pointList.length-1; i++) {
			dist = google.maps.geometry.spherical.computeDistanceBetween( pointList[i].position, pointList[i+1].position );
			pointList[i].dist = dist;
			this.total_length += dist;
		}
		this.drawTotalWay( this.total_length, pointList );
     };

     this.getMoveDroneRate = function( missionNum, pos ){

     		if( pointList.length-1 < missionNum || missionNum < 1 ) return;

     		var myLatlng = new google.maps.LatLng( pos[0], pos[1] );

     		var currentNum = missionNum-1;
     		//현좌표와 현재 미션좌표와의 거리
     		var uavDist = google.maps.geometry.spherical.computeDistanceBetween( pointList[currentNum].position, myLatlng );

     		var currentDist = 0;
     		var totalDist = 0;
     		var dist = 0;
     		for(var i = 0; i < pointList.length-1; i++) {
			dist = google.maps.geometry.spherical.computeDistanceBetween( pointList[i].position, pointList[i+1].position );
			if( i < currentNum ){	//현재 미션번호까지 거리 저장
				currentDist += dist;
			}
			totalDist += dist;	//전체 거리 저장
		}

		var sumDist = uavDist + currentDist; //시작점부터 현위치까지의 거리
		var distRate = sumDist / totalDist * 100;  //이동거리 비율

		return distRate;
     };

	//pixel좌표로 마크 만들기
	this.setMarkByPixel = function( pos ){
		var point=new google.maps.Point(Number(pos.x),Number(pos.y));
		var location=overlay.getProjection().fromContainerPixelToLatLng(point); 
		if( pointList.length === 0 ){
			this.makeStartPoint();	
		}
		this.addRoute({position:location});	
	};

	this.setClickListener = function(){
		var _this = this;
		mapClickListener = google.maps.event.addListener(map, 'click', function(e){
			
			//모바일 투터치 버그 관련
			_this.removeClickListener();
			setTimeout( function(){
				_this.setClickListener();
			},300);

			_this.clickEvent(e);
			
		});
	};
	
	this.removeClickListener = function(){
		if(mapClickListener !== undefined && mapClickListener !== null )
				google.maps.event.removeListener(mapClickListener);
	};
	
	this.changeLatLng = function(latLng){
		map.setCenter({lat:latLng[0], lng:latLng[1]});

		//var position = new google.maps.LatLng(latLng[0], latLng[1]);
		//this.setDronePosition(position);
	};

	
	
	this.changeZoom = function(value){
		map.setZoom(Number(value));
	};

	this.getZoom = function(){
		return map.getZoom();
	};

	this.getCenter = function(){
		return map.getCenter();
	};
	
	this.reSetting = function(){
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center);
	};

	this.getWayPointData = function(){
		var data = {
			mode : "setMission",
			count : pointList.length,	//시작점 추가 +1
			frame : 0,
			items : []
		};

		if( pointList.length > 0 ){
			
			for( var i = 0; i < pointList.length; i++ ){
				var itemData = pointList[i].getData();
				itemData.seq = 0;
				if( i === 0 ){
					itemData.command = 22;
				}else if( i == pointList.length - 1){	//마지막점은 land
					itemData.command = 21;
				}
				data.items.push( itemData );
			}	
		}

		return data;
	};

	//로컬에 저장되어있는 waypoint불러오기
	this.loadPointPoliyLine = function( dataList ){
		this.clearMarker();
		this.makeStartPoint();
		for( var i = 0; i< dataList.length; i++ ){
			var myLatlng = new google.maps.LatLng(dataList[i].x,dataList[i].y);
			var dataObj = {
				state : dataList[i].command,
				height : dataList[i].z
			};
			var data = { position : myLatlng, dataObj : dataObj };
			this.addRoute( data );		
		}
	};

	//드레그시 다시 그리기
	this.redrawPointPoliyLine = function( index ){
	  	//this.setWayPointData( pointList );
     		var newPointArr = [];
     		 for( var i = 0; i<pointList.length; i++ ){
	     		if( pointList[i].index != index  ){
	     			newPointArr.push( pointList[i].getData() );
	     		}
	     	}

	     this.setWayPointData( newPointArr );
     };

     //드론에 저장되어있는 미션 불러오기( 미션 실행중에도 불러오는 경우있음 )
	this.setWayPointData = function( dataList ){
		this.clearMarker();
		for( var i = 0; i< dataList.length; i++ ){
			var myLatlng = new google.maps.LatLng(dataList[i].x,dataList[i].y);
			var dataObj = {
				state : dataList[i].command,
				height : dataList[i].z
			};
			var data = { position : myLatlng, dataObj : dataObj };
			if( i === 0 ){
				this.makeStartPoint( data );
			}else{
				this.addRoute( data );		
			}
		}

		this.beforeDrawMovedLine( DroneModel.currentMissionNum );
	};

	 this.makeStartPoint = function( data2 ){
     	var pos = null;
   		var dronPos = ( this.drone !== undefined && this.drone !== null ) ? this.drone.position : this.drone2.position;
		if( ( this.drone === null && this.drone2 === null ) || typeof dronPos === 'function' ){
			pos = map.getCenter();
		}else{
			pos = dronPos;
		}	
		var markerImage = new google.maps.MarkerImage('images/icons/ico_startpoint.png',
			new google.maps.Size(23, 23),
			new google.maps.Point(0, 0),
			new google.maps.Point(12, 12));

		var data = {
			position : pos,
			icon : markerImage,
			iconOn : markerImage,
			index : ""
		};
		$.extend( data, data2 );
		this.addRoute( data );
    };

	this.clearMarker = function(){

		if( route === undefined || route === null ) return;

		for( i = 0; i < pointList.length; i++ ){
			pointList[i].remove();
		}
		pointList = null;
		this.reset();
		ModalService.allClose('settingPop');
	};

	var testRotate = 0;//테스트 값
	//publilc
	this.changeHead = function( head ){

		//테스트 실제 head값의 각도 계산이 필요함
		if( testRotate < 360 ){
			testRotate+=5*head;
		}else{
			testRotate = 0;
		}
		this.container.css('rotate', testRotate );
	};

	//지도 클릭시 waypoint 생성
	this.changeToWaypoint = function(){
		this.clearMarker();
		pointType = "waypoint";
	};

	//지도 클릭시 camera point 생성
	this.changeToCamerapoint = function(){
		pointType = "camerapoint";	
	};

	//오토모드
	this.changeToAuto = function(){
		this.clearMarker();
		pointType = "auto";
	};
	

	this.makeCameraArea = function(data){

		var cameraViewPoint = new CameraViewPoint(data);
		viewPointList.push( cameraViewPoint );
	};

	this.makeCameraPoint = function(){
		TemplateService.makeCamerArea();
	};
	
	/*************************************
	* 
	* CameraViewPoint
	* 
	*/

	CameraViewPoint = function(data){
		this.data = data;

		this.init();
	};
	CameraViewPoint.prototype.data = {};
	CameraViewPoint.prototype.init = function(){

		var data = this.data;
		//중심좌표
		var point=new google.maps.Point(Number(data.x),Number(data.y));
		var location=overlay.getProjection().fromContainerPixelToLatLng(point); 

		//반지름 이동한 좌표
		var point2=new google.maps.Point(Number(data.x+data.radius),Number(data.y));
		var location2=overlay.getProjection().fromContainerPixelToLatLng(point2); 

		//두 좌표간의 거리
		var dist = google.maps.geometry.spherical.computeDistanceBetween( location, location2 );

		var options = {
			strokeColor: "#FF0000",
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: "#FF0000",
			fillOpacity: 0.35,
			map: map,
			center: location,
			radius: dist
		};
		var cityCircle = new google.maps.Circle(options);
		var elevator = new google.maps.ElevationService();
		
		elevator.getElevationForLocations({
			'locations': [location]
		}, function(results) {
			var altitude = results[0].elevation;
			google.maps.event.addListener( cityCircle, 'click', function() {
				alert('고도 : ' + altitude );
			});	
		});
	};

	CameraViewPoint.prototype.getData = function(){
		var data = this.data;
		return data;
	};

	/*************************************
	* 
	* pointItem
	* 
	*/
	PointItem = function( obj ){

		if( iconImg !== null ) this.icon = iconImg;
		if( iconOnImg !== null ) this.iconOn = iconOnImg;

		$.extend(this, obj );
		this.init();
	};
	
	PointItem.prototype.index = 0;
	PointItem.prototype.position = null;
	PointItem.prototype.map = null;
	PointItem.prototype.point = null;
	PointItem.prototype.overlay = null;
	PointItem.prototype.dataObj = {};
	PointItem.prototype.clickListener = null;
	PointItem.prototype.deleteListener = null;
	PointItem.prototype.updateWayPoint = null;
	PointItem.prototype.icon =  "images/icons/bg_waypoint.png";
	PointItem.prototype.iconOn =  "images/icons/bg_waypoint_on.png";
	
	PointItem.prototype.init = function(){
		this.defaultDataSetting();
		this.makeItem();
		this.getHeight();
	};

	PointItem.prototype.defaultDataSetting = function(){
		this.dataObj.speed = 10;
		this.dataObj.index = this.index;

		this.position.G = this.position.G || this.position.lat();
		this.position.K = this.position.K || this.position.lng();
	};

	PointItem.prototype.getHeight = function(){
		var elevator = new google.maps.ElevationService();
		var _this = this;

		//https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536,-104.9847034&key=API_KEY

		elevator.getElevationForLocations({
			'locations': [this.position]
		}, function(results) {
			_this.dataObj.height = results[0].elevation.toFixed(2);
			if( _this.updateWayPoint !== null ) _this.updateWayPoint( _this.dataObj );
		});

	};

	PointItem.prototype.makeItem = function(){

		var index = ( this.index === null || isHomeCheck ) ? "" : this.index + "";
		this.point = new google.maps.Marker({
			position: this.position,
			map: map,
			//draggable: true,
			label : index,
			zIndex:1,
			icon: this.icon,
			topGap: -47
		});
		this.eventSetting();
	};

	
	PointItem.prototype.eventSetting = function(){
		var _this = this;

		if( pointType == "auto" && this.makeAutoPop !== undefined && this.makeAutoPop !== null ){
			this.makeAutoPop( this );
		}else{
			google.maps.event.addListener( this.point, 'click', function() {
				_this.clickListener( _this );
			});

			google.maps.event.addListener(this.point,'dragend',function() {
				_this.position = _this.point.getPosition();
				_this.dragendListener( _this );
			});
		}
		
	};

	PointItem.prototype.on = function(){
		this.point.setIcon( this.iconOn );
	};
	PointItem.prototype.off = function(){
		this.point.setIcon( this.icon );
	};

	PointItem.prototype.getData = function(){
		var tarX = this.position.G || this.position.lat();
		var tarY = this.position.K || this.position.lng();

		var data = {
			index : this.index,
			x : tarX.toFixed(7),
			y : tarY.toFixed(7),
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
	
	PointItem.prototype.saveData = function( dataObj ){
		this.dataObj = dataObj;
	};

	PointItem.prototype.remove = function(){
		this.point.setMap(null);
		$(this.point.label.span).remove();	//markerLabel 생성된 있는 번호들어있는  span 지우기
	};

});