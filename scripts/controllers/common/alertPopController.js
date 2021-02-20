kindFramework.controller('alertPopController', function( $scope ){
	this.setText = function( text ){
		$scope.text = text;
	};

	this.setTitle = function( title ){
		$scope.title = title;
	};
});