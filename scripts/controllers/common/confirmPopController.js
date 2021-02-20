kindFramework.controller('confirmPopController', function( $scope, close ){

	this.setText = function( text ){
		$scope.text = text;
	};

	$scope.ok = function(){
		close(true, 500);
	};

	$scope.cancel = function(){
		close(false, 500);
	};

});