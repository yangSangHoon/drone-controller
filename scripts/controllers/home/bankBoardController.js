kindFramework.controller('bankBoardController', function( $scope, $element, BankBoardService, BroadcastAPI){
	BankBoardService.init( $element );

	$scope.$on( BroadcastAPI.BANK_ROLL, function( e,  data ){
		BankBoardService.setBank( data.roll );		
	});
});