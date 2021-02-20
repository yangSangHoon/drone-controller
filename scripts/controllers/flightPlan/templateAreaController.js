kindFramework.controller('templateAreaController', function( $scope, $rootScope, $element, BroadcastAPI, TemplateService ){
	
	$scope.showTemplatePopup = function(){
		$("#templateList").toggle();
	};
	
	$scope.makeTemplate = function(n){
		TemplateService.makeTemplate(n);
	};
	
	//TemplateService.makeTemplate(1);
});