kindFramework.controller('loadWaypointController', function( $scope, $rootScope, $element, BroadcastAPI, PopupManager ){

	function roadData(){
		var datas = localStorage.savedWayPoint;
		if( datas === undefined || datas === null || datas === "" ){
			$scope.datas = [];
		}else{
			$scope.datas = JSON.parse(datas);	
		}
	}

	$scope.listClick = function( value ){
		$rootScope.$emit( BroadcastAPI.LOAD_WAYPOINT, value);
	};

	$scope.deleteItem = function( value ){

		PopupManager.confirm("삭제하시겠습니까?", function(result){
			if( result === true ){
				var arr = $scope.datas;
				for( var i = 0; i<arr.length; i++ ){
					if( arr[i].name == value ){
						arr.splice( i, 1 );
						break;
					}
				}
				localStorage.setItem('savedWayPoint', JSON.stringify(arr) );
			}
		});
	};

	$scope.deleteAll = function(){
		PopupManager.confirm("모든 미션을 삭제하시겠습니까?", function(result){
			if( result === true ){
				$scope.datas = [];
				localStorage.setItem('savedWayPoint', '' );		
			}
		});
		
	};

	$rootScope.$on( BroadcastAPI.SAVE_COMPLETE_WAYPOINT, function(){
		roadData();
	});	

	roadData();
	
});