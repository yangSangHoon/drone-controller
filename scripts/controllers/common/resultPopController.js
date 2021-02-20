kindFramework.controller('resultPopController', function( $scope, close ){
	
	this.setText = function( text ){
		$scope.text = text;
	};

	$scope.ok = function(){
		close(null, 500);
	};

});