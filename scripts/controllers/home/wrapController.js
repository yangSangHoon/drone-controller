kindFramework.controller('wrapController', function($scope, BroadcastAPI, $timeout ){
	
	function sizeCheck(){
		var w = $(window).width();
		var h = $(window).height();
		if( w < 1000 ){
			$scope.$emit( BroadcastAPI.BOTTOM_HIDE );
		}
		
		if( h < 600 ){
			$scope.$emit( BroadcastAPI.SIDE_HIDE );
			$scope.$emit( BroadcastAPI.GYROSCOPE_HIDE );
		}
	}
	
	$(window).resize(function(){
		sizeCheck();
	});
	
	$timeout( sizeCheck, 70 );

});