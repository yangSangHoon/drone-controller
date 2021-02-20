kindFramework.controller('sideBtnController', function($rootScope, BroadcastAPI,$element){
	function hide(){
		$element.hide();
	}
	
	$rootScope.$on( BroadcastAPI.SIDE_HIDE, hide );
});