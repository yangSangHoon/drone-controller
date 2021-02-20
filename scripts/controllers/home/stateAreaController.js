kindFramework.controller('stateAreaController', function( $scope, BroadcastAPI ){

	$scope.$on( BroadcastAPI.STATUS_MESSAGE, function( e, message ){
		
		$scope.text = message.text;	
	});

	
});