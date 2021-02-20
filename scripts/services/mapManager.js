kindFramework.factory('MapManager', function(){

	MapManager = function(){
		this.proj = new MercatorProjection();
	};

	MapManager.prototype = {
		currentLatLng : { lat:37.561192, lng:127.030487}, //현재 위도 경도
		canvas : null,
		possibleDistance : 1,
		context : null,
		zoom : 15,
		mapType : "satellite",
		imageSize : 400,
		stCl : null,
		emCl : null,
		tCl : null,
		bCl : null,
		proj : null,
		url : null,
	};

	MapManager.prototype.init = function( obj ){

		$.extend(this, obj);

		if( this.canvas !== null ) this.context = this.canvas.getContext('2d');
		
	};

	MapManager.prototype.dataCheck = function(){
		this.stCl = this.destVincenty( this.currentLatLng.lat, this.currentLatLng.lng, -90, this.possibleDistance * 1000 );
		this.emCl = this.destVincenty( this.currentLatLng.lat, this.currentLatLng.lng, 90, this.possibleDistance * 1000 );

		this.tCl = this.destVincenty( this.currentLatLng.lat, this.currentLatLng.lng, 0, this.possibleDistance * 1000 );
		this.bCl = this.destVincenty( this.currentLatLng.lat, this.currentLatLng.lng, 180, this.possibleDistance * 1000 );
	};

	MapManager.prototype.saveMap = function( obj ){
		

		this.currentLatLng = obj.currentLatLng;
		this.possibleDistance = obj.possibleDistance;
		this.zoom = obj.zoom;
		this.dataCheck();
		var mapData =  this.getMapData();
		console.log( "mapList.length : " +  mapData.mapList.length);
		$.ajax({
			url: this.url + '/downloadMap',
			dataType: 'json',
			data: mapData,
			success: obj.success,
			error: obj.error
		});
	};

	MapManager.prototype.removeMap = function( obj ){
		$.ajax({
			url: this.url + '/removeMap',
			dataType: 'json',
			type : "POST",
			success: obj.success,
			error: obj.error
		});
	};

	MapManager.prototype.getMap = function( obj ){

		$.ajax({
			url : this.url + '/mapData',
			dataType : 'json',
			type : "POST",
			async: false,
			success: obj.success,
			error: obj.error
		});
	};

	/*
	*왼쪽상단을 시작좌표로 하여 할줄씩 데이타를 저장
	*/
	MapManager.prototype.getMapImageData = function(){
		
		var latLngArr = [];	//col list

		var stLatLng = { lat: this.tCl.lat, lng : this.stCl.lng };

		latLngArr.push( this.getMapRowImageData(stLatLng) );

		while(1){
			stLatLng = this.GetTileDelta( stLatLng, { x : 0, y : +1 } );	//하단의 위도경도 좌표얻기
			latLngArr.push( this.getMapRowImageData( stLatLng) );
			
			if( stLatLng.lat < this.bCl.lat ){	
				break;
			}
		}
		return latLngArr;
	};

	//한줄에 대한 맵데이타
	MapManager.prototype.getMapRowImageData = function(stLatLng){

		var latLngArr = []; //row list
		latLngArr.push(stLatLng);

		while(1){
			var beforeLatlng = latLngArr[latLngArr.length-1];
			var newLatlng = this.GetTileDelta( beforeLatlng, {x:+1,y:0} ); //우측의 위도경도 좌표 얻기
			latLngArr.push( newLatlng );
			if( newLatlng.lng > this.emCl.lng ){
				break;
			}
		}
		return latLngArr;
	};

	MapManager.prototype.GetTileDelta = function(center,delta){
		var zoom = this.zoom;
		var mapWidth = this.imageSize;
		var mapHeight = this.imageSize;
		
		var scale = Math.pow( 2, zoom );
		var centerPx = this.proj.fromLatLngToPoint(center);
		var DeltaPx = {
			x: (centerPx.x + ((mapWidth / scale) * delta.x)) ,
			y: (centerPx.y + ((mapHeight/ scale) * delta.y))
		};
		var DeltaLatLon = this.proj.fromPointToLatLng(DeltaPx);
		return DeltaLatLon;
	};

	//이미지 정보와 타일 좌표 리턴	
	MapManager.prototype.getMapData = function(){

		var mapDataList = this.getMapImageData();

		var rowN = mapDataList.length;
		var colN = mapDataList[0].length;
		
		var mapList = [];
		
		for( var i =0 ; i<mapDataList.length; i++ ){
			for( var j =0 ; j<mapDataList[i].length; j++ ){
				var data = mapDataList[i][j];
				var obj = {};
				obj.imgUrl = "http://maps.googleapis.com/maps/api/staticmap?";
				obj.imgUrl += "center=" + data.lat + "," + data.lng + "&zoom=" + this.zoom + "&size=" + this.imageSize + "x" + this.imageSize + "&maptype=" + this.mapType + "&sensor=false";
				obj.position = { x : j, y : i };
				mapList.push( obj );
			}
		}

		//시작과 끝의 위경도는 저장하는 이미지의 가운데 위경도를 기준으로 넘겨줘야함
		var sLatLng = mapDataList[0][0];	//시작 위경도
		var lastDatas = mapDataList[mapDataList.length-1]; 
		var eLatLng = lastDatas[lastDatas.length-1];	//끝 위경도

		var mapData = {
			currentLatLng : this.currentLatLng,
			mapList : mapList,
			rowN : rowN,
			colN : colN,
			sLatLng : sLatLng,
			eLatLng : eLatLng,
		};

		return mapData;
	};

	//캔서스에 큰 맵이미지 만들기
	MapManager.prototype.makeImg = function(){

		var mapDataList = this.getMapImageData();

		var rowN = mapDataList.length;
		var colN = mapDataList[0].length;
		$(this.canvas).attr({ 'width' : colN * this.imageSize + 'px', 'height' : rowN * this.imageSize +'px',  });

		var _this = this;
		
		function drawImage( i, j ){
			var data = mapDataList[i][j];
			var url  = "http://maps.googleapis.com/maps/api/staticmap?";
			url += "center=" + data.lat + "," + data.lng + "&zoom=" + _this.zoom + "&" + _this.imageSize + "x" + _this.imageSize + "&sensor=false";

			var imageObj = new Image();
			imageObj.onload = function() {
				_this.context.drawImage( imageObj, j * _this.imageSize, i * _this.imageSize );					
			};
			imageObj.src = url;
		}
		
		for( var i =0 ; i<mapDataList.length; i++ ){
			for( var j =0 ; j<mapDataList[i].length; j++ ){
				drawImage(i,j);
			}
		}
	};

	MapManager.prototype.toRad = function(n) {
		return n * Math.PI / 180;
	};
	MapManager.prototype.toDeg = function(n) {
		return n * 180 / Math.PI;
	};
	MapManager.prototype.destVincenty = function(lat1, lon1, brng, dist) {
		var a = 6378137,
		b = 6356752.3142,
		f = 1 / 298.257223563, // WGS-84 ellipsiod
		s = dist,
		alpha1 = this.toRad(brng),
		sinAlpha1 = Math.sin(alpha1),
		cosAlpha1 = Math.cos(alpha1),
		tanU1 = (1 - f) * Math.tan(this.toRad(lat1)),
		cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)), sinU1 = tanU1 * cosU1,
		sigma1 = Math.atan2(tanU1, cosAlpha1),
		sinAlpha = cosU1 * sinAlpha1,
		cosSqAlpha = 1 - sinAlpha * sinAlpha,
		uSq = cosSqAlpha * (a * a - b * b) / (b * b),
		A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq))),
		B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq))),
		sigma = s / (b * A),
		sigmaP = 2 * Math.PI;
		var cos2SigmaM = 0;
		var sinSigma = 0;
		var cosSigma = 0;
		var deltaSigma = 0;
			
		while (Math.abs(sigma - sigmaP) > 1e-12) {
			cos2SigmaM = Math.cos(2 * sigma1 + sigma);
			sinSigma = Math.sin(sigma);
			cosSigma = Math.cos(sigma);
			deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
			sigmaP = sigma;
			sigma = s / (b * A) + deltaSigma;
		}
		var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1,
		lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1, (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp)),
		lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1),
		C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha)),
		L = lambda - (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
		//var revAz = Math.atan2(sinAlpha, -tmp) // final bearing
		return { lat: this.toDeg(lat2), lng : lon1 + this.toDeg(L) };
	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	MercatorProjection = function() {
		this.init();
	};

	MercatorProjection.prototype = {
		MERCATOR_RANGE : 256,
		pixelOrigin_ : null,
		pixelsPerLonDegree_ : null,
		pixelsPerLonRadian_ : null
	};

	MercatorProjection.prototype.init = function() {
		this.pixelOrigin_ = {x: this.MERCATOR_RANGE / 2, y: this.MERCATOR_RANGE / 2};
		this.pixelsPerLonDegree_ = this.MERCATOR_RANGE / 360;
		this.pixelsPerLonRadian_ = this.MERCATOR_RANGE / (2 * Math.PI);
	};

	MercatorProjection.prototype.fromLatLngToPoint = function(latLng) {
		
		var me = this;

		var point = {x:0,y:0};

		var origin = me.pixelOrigin_;
		point.x = origin.x + latLng.lng * me.pixelsPerLonDegree_;
		// NOTE(appleton): Truncating to 0.9999 effectively limits latitude to
		// 89.189. This is about a third of a tile past the edge of the world tile.
		var siny = this.bound(Math.sin( this.degreesToRadians(latLng.lat)), -0.9999, 0.9999);
		point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny) ) * -me.pixelsPerLonRadian_;
		return point;
	};

	MercatorProjection.prototype.fromPointToLatLng = function(point) {
		var me = this;
		var origin = me.pixelOrigin_;
		var lng = (point.x - origin.x) / me.pixelsPerLonDegree_;
		var latRadians = (point.y - origin.y) / -me.pixelsPerLonRadian_;
		var lat = this.radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);
		return {lat:lat, lng:lng};
	};

	MercatorProjection.prototype.bound = function(value, opt_min, opt_max) {
		if (opt_min !== null && opt_min !== undefined) value = Math.max(value, opt_min);
		if (opt_max !== null && opt_max !== undefined) value = Math.min(value, opt_max);
		return value;
	};

	MercatorProjection.prototype.degreesToRadians = function(deg) {
		return deg * (Math.PI / 180);
	};

	MercatorProjection.prototype.radiansToDegrees = function(rad) {
		return rad / (Math.PI / 180);
	};

	return new MapManager();
});




























