kindFramework.directive('mainMap', function(){
	return {
		templateUrl : 'views/flightPlan/main_map.html',
		controller : 'mainMapController',
		scope : true
	};
});

kindFramework.directive('mapBtnArea', function(){
	return {
		templateUrl : 'views/flightPlan/map_btn_area.html',
		controller : 'mapBtnAreaController',
		scope : true
	};
});

kindFramework.directive('infoArea', function(){
	return {
		templateUrl : 'views/flightPlan/info_area.html',
		controller : 'infoAreaController',
		scope : true
	};
});

kindFramework.directive('templateArea', function(){
	return {
		templateUrl : 'views/flightPlan/template_area.html',
		controller : 'templateAreaController',
		scope : true
	};
});

kindFramework.directive('commandBtnArea', function(){
	return {
		templateUrl : 'views/flightPlan/command_btn_area.html',
		controller : 'commandBtnAreaController',
		scope : true
	};
});


kindFramework.directive('test', function(){
	return {
		templateUrl : 'views/flightPlan/test.html',
		controller : 'testController',
		scope : true
	};
});


