kindFramework.controller('saveWaypointController', function( $scope,  $rootScope, $element, BroadcastAPI, MapService, PopupManager ){
	
	$scope.save = function(){
		// load before localStorage.savedWayPoint
		var wayPointData = MapService.getWayPointData();
		if( wayPointData.items !== null && wayPointData.items.length > 1 ){
			var savedData = localStorage.getItem( 'savedWayPoint' );
			var savedWayPointArrayData = null;
			if( savedData === null || savedData === "" ){
				savedWayPointArrayData = [];
			}else{
				savedWayPointArrayData = JSON.parse(savedData);
			}
			
			// make new object (save name & data)
			var tempJ = {};
			tempJ.name = $scope.name;
			tempJ.value = wayPointData.items;

			// save object to localStorage.savedWayPoint
			savedWayPointArrayData.push(tempJ);
			localStorage.setItem('savedWayPoint', JSON.stringify(savedWayPointArrayData) );

			//$rootScope.$emit( BroadcastAPI.SAVE_WAYPOINT );
			PopupManager.toast("저장되었습니다.");

			$rootScope.$broadcast( BroadcastAPI.SAVE_COMPLETE_WAYPOINT );	

			$scope.name = "";
			$scope.$apply();
		}else{
			PopupManager.toast("미션경로를 추가해주세요");
		}
		
		
	};
});