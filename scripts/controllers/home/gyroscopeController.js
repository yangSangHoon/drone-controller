kindFramework.controller('gyroscopeController', function($rootScope, $scope, BroadcastAPI, $element, GyroscopeService ){
	function hide(){
		$element.hide();
	}
	
	GyroscopeService.init( $element );
	
	$rootScope.$broadcast( BroadcastAPI.GYROSCOPE_HIDE, hide );

	$scope.$on( BroadcastAPI.GYROSCOPE_PITCH, function( e,  data ){
		GyroscopeService.changeArtificiel( data.pitch );		
		GyroscopeService.changeHorizen( data.roll );		
	});
});