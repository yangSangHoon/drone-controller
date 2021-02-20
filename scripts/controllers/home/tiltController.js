kindFramework.controller('tiltController', function( $scope, $element, ControllerDataPool){
	
	function changeData(num){
		$scope.num = num;
		$scope.$apply();
	     	ControllerDataPool.send({
	   		chan6_raw : num
	  	});
	}
	
	$element.find('#slider').slider({
	     value: 0,
	     min: 993,
	     max: 2016,
		slide: function( event, ui ) {
	     		changeData( ui.value );
	     }
	});

	$scope.num = 0;

	

});