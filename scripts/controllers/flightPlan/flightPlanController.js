kindFramework.controller('flightPlanController', function( SendDataService, ModalService, DroneModel, SockManagerService ){

	//SendDataService.setAuto();

	ModalService.allClose();

	DroneModel.init();

	SockManagerService.connect();
});
