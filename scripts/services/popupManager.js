kindFramework.service( 'PopupManager', function( ModalService, ToastService ){

	var alertToast = null;
	this.alert = function( text, level ){
		if( alertToast === null ) alertToast = new ToastService();
		
		var tit = "";
		switch( level ){
			case 0 : 
				tit = "Emergency";
				break;

			case 1 : 
				tit = "Alert";
				break;

			case 2 : 
				tit = "Critical";
				break;

			case 3 : 
				tit = "Error";
				break;

			case 4 : 
				tit = "Warning";
				break;

			case 5 : 
				tit = "Notice";
				break;

			case 6 : 
				tit = "Info";
				break;

			default :
				tit = "Info";
				break;
		}
		alertToast.show({
			text : text,
			tit : tit,
			html : 'views/popup/alert_pop.html', 
			controller : 'alertPopController' 
		});
	};

	this.confirm = function( text, returnFunc ){
		ModalService.showModal({
			templateUrl: 'views/popup/confirm_pop.html',
			controller: 'confirmPopController',
		}).then(function(modal) {
			modal.controller.setText( text );

			modal.close.then(function(result) {
				returnFunc( result );
			});
		});
	};

	this.result = function(text){
		ModalService.showModal({
			templateUrl: 'views/popup/result_pop.html',
			controller: 'resultPopController',
		}).then(function(modal) {
			modal.controller.setText( text );
		});
	};

	var toastPop = null;
	this.toast = function(text){
		if( toastPop === null ) toastPop = new ToastService();
		toastPop.show({
			text : text,
			html : 'views/popup/toast_pop.html'
		});
	};

	var progreeTimer = null;
	var progressCon = null;
	this.showProgress = function(){
		if( window.disconnectedSocket === true ){
			this.alert('서버와 연결되지 않았습니다.');
		}else{
			progressCon = $('<div class="modal_wrap"></div>');
			var progress = $('<div class="progress"></div>');
			progressCon.append( progress );
			$('body').append(progressCon);
			var _this = this;
			progreeTimer = setTimeout( function(){
				_this.hideProgress();
				_this.toast('요청시간이 초과하였습니다.<br/>네트워크 및 드론상태를 확인해주세요');
				window.disconnectedSocket = true;
			}, 1000 );	
		}
	};

	this.hideProgress = function(){
		if( progreeTimer !== null ) clearTimeout( progreeTimer );
		if( progressCon !== null ) progressCon.remove();
	};

});