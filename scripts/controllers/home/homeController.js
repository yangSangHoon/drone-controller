kindFramework.controller('homeController', function( SockManagerService, ModalService, DroneModel ){
	ModalService.allClose();

	DroneModel.init();

	SockManagerService.connect();
});
