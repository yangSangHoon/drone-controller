kindFramework.controller('directionController', function( $scope, $element, BroadcastAPI ){
	var arrow = $element.find('.arrow');

	function setDirection(data){
		/*var value = data.heading;
		var degree = value * 360/Math.PI;*/
		var degree = Math.floor( data );
		arrow.css('-webkit-transform', 'rotate(' + degree + 'deg)');
		arrow.css('-ms-transform', 'rotate(' + degree + 'deg)');
		arrow.css('transform', 'rotate(' + degree + 'deg)');
	}

	$scope.$on( BroadcastAPI.DRONE_DIRECTION, function(e, value){
		setDirection( value * 0.01 );
	});
	
});