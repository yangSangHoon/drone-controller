kindFramework.controller( 'testController', function( $scope, SockManagerService ){

	$scope.isShow = false;
	var params = location.href.split("?")[1];
	if( params == "debug=1" ){
		$scope.isShow = true;
	}
	
	function send(msgid){
		var data = {
			mode : 'send',
			msgid : msgid
		};
		SockManagerService.send( data );
	}
	
	$scope.test1 = function(){
		send(1);
	};

	$scope.test2 = function(){
		send(2);
	};

	$scope.test3 = function(){
		send(3);
	};

	$scope.test4 = function(){
		send(4);
	};
	$scope.test5 = function(){
		send(5);
	};
	$scope.test6 = function(){
		send(6);
	};
	$scope.test7 = function(){
		send(7);
	};
	$scope.test8 = function(){
		send(8);
	};
	$scope.test9 = function(){
		send(9);
	};
	$scope.test10 = function(){
		send(10);
	};
	$scope.test11 = function(){
		send(11);
	};

	$scope.test12 = function(){
		send(12);
	};

	$scope.test13 = function(){
		send(13);
	};

	$scope.test14 = function(){
		send(14);
	};
	$scope.test15 = function(){
		send(15);
	};
	$scope.test16 = function(){
		send(16);
	};
	$scope.test17 = function(){
		send(17);
	};
	$scope.test18 = function(){
		send(18);
	};
	$scope.test19 = function(){
		send(19);
	};
	$scope.test20 = function(){
		send(20);
	};
	$scope.test21 = function(){
		send(51);
	};
	$scope.test22 = function(){
		send(52);
	};
	$scope.test23 = function(){
		send(53);
	};
	$scope.test31 = function(){
		send(61);
	};
	$scope.test32 = function(){
		send(62);
	};
	$scope.test33 = function(){
		send(63);
	};



});
