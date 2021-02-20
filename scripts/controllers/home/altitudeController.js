kindFramework.controller('altitudeController', function( $scope, $element, DashBoad, BroadcastAPI ){
		
	var dashBoad = new DashBoad($element, -1, {
		NUM : 10,
		GAP : 2,
		DATA_GAP :10,
		LINE_HEIGHT : 25,
		SHORT_SIZE : 7
	});

	$scope.$on( BroadcastAPI.ALTITUDE, function( e,  data ){
		dashBoad.setValue( data.alt.toFixed(2) );
	});
	
});