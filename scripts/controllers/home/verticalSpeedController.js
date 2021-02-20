kindFramework.controller('verticalSpeedController', function( $scope, $element, VerticalSpeedService, BroadcastAPI ){
	VerticalSpeedService.init({
		canvas : $element.find('canvas')[0]
	});

	$scope.$on( BroadcastAPI.VERTICAL_SPEED, function( e, value ){
		VerticalSpeedService.changeValue( value );
	});
});