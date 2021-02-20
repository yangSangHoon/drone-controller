
kindFramework.controller('cameraViewSubController', function($rootScope, $scope, $element, ViewSwapService ){

	/*if( window.plugins !== undefined ){
		setTimeout(function(){
			window.plugins.html5Video.play("subVideo" ); 
		}, 1500);
	}else{
		var source = $("<source>");
		if( $("#subVideo").length > 0 ){
			$("#subVideo").append( source );
			source[0].src = "./sub.mp4";
			source[0].type = "video/mp4";
			$("#subVideo")[0].play();	
		}
	}
	*/

	ViewSwapService.setLeftView($element);
	
	$scope.changeView = function(){
		ViewSwapService.changeView($element);
	};

	setTimeout( function(){
        setting();
     },500);

     function setting(){

		 $scope.displayInfo2 = 'fit-screen';

		var profileInfo = {
	          device:{
	              channelId:1,
	              port:8088,
	              server_address:'192.168.0.100',
	              cameraIp:'192.168.0.202',
	              user:'admin',
	              password:'4321'
	          },
	          media:{
	              type:'live',  
	              size:{
	                  width:320,
	                  height:240
	              },
	              requestInfo:{
	                  cmd:'open',
	                  url:'profile2',
	                  scale:1//
	              }
	          }
	          
	      };
	      $scope.playerdata2 = profileInfo;
     }
      
});