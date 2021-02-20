kindFramework.controller('loginController', function( $scope, PopupManager, $filter, SockManagerService ){

	$scope.id = 'hanwha';
	$scope.pw = 'hanwha';
	$scope.ip = '192.168.0.100';
	
	var userList = [
					{
						id : 'hanwha',
						pw : 'hanwha'
					},
					{
						id : 'uav',
						pw : 'uav'
					}];

	$scope.login = function(){
		var check = -1;
		for( var i = 0; i<userList.length; i++ ){
			if( userList[i].id == $scope.id && userList[i].pw == $scope.pw ){
				check = i;
				break;
			}
		}

		if( check == -1 ){
			PopupManager.toast( $filter('translate')('CHECK_ID_PW') );
		}else{
			window.disconnectedSocket = false;
			PopupManager.showProgress();
			SockManagerService.connect({
				ip : $scope.ip,
				port : $scope.port,
				success : function(){
					location.href="#/home";	
					PopupManager.hideProgress();		
				},
				error : function(){
					PopupManager.hideProgress();
					//PopupManager.toast( $filter('translate')('FILED_CONNECT') );	
				}
			});
			
		}
	};

	/*$scope.currentLanguage = MultiLanguage.getCurrentLanguage();
	var languages = MultiLanguage.getLanguages();
     $scope.languages = languages;
     $scope.changeLanguage = function(){
		MultiLanguage.setLanguage( $scope.selectedItem );
     };*/

     $scope.logoClick = function(){
		location.href="#/home";	
	};

	////////////////////////////////////

	/*var p1 = {x :0, y: 200 };
	var p2 = {x :100, y: 70 };
	var cp = { x:90, y:120 };

	var canvas = $("#cc")
	var ctx = canvas[0].getContext("2d");
	ctx.beginPath();
	ctx.moveTo( p1.x, p1.y );
	ctx.lineTo( p2.x, p2.y );
	ctx.strokeStyle = '#aaa';
	ctx.lineWidth = 1;
	ctx.stroke();	
	ctx.closePath();

	ctx.beginPath();
	ctx.moveTo( p1.x, p1.y );
	ctx.lineTo( cp.x, cp.y );
	ctx.strokeStyle = 'blue';
	ctx.lineWidth = 1;
	ctx.stroke();	
	ctx.closePath();


	var np = getDroneWayPosition();
	ctx.beginPath();
	ctx.moveTo( p1.x, p1.y );
	ctx.lineTo( np.x, np.y );
	ctx.strokeStyle = 'red';
	ctx.lineWidth = 2;
	ctx.stroke();	
	ctx.closePath();	

	function getDroneWayPosition(){
		var newPos = {};
		
		var distance = Math.sqrt( Math.pow( p1.x - cp.x, 2 ) + Math.pow( p1.y - cp.y, 2 ) );

		var dx = p2.x - p1.x;
	   	var dy = p2.y - p1.y;
	   
		var rad = Math.atan2(dy, dx);
		var degree = ( rad * 180 )/Math.PI;
		newPos.x = p1.x + distance * Math.cos( rad );
		newPos.y = p1.y + distance * Math.sin( rad );

		
		return newPos;
	}
*/


});