kindFramework.controller('speedController', function( $scope, $element, DashBoad, BroadcastAPI ){
	
	var dashBoad = new DashBoad($element);
	
	$scope.$on( BroadcastAPI.SPEED, function( e,  data ){
		dashBoad.setValue( data.airspeed.toFixed(2) );
	});

});