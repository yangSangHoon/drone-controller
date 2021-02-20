kindFramework.factory('ToastService', function( ModalService ){

	ToastService = function(){
		this.init();
	};

	ToastService.prototype = {
		toastArr : null,
	};

	ToastService.prototype.init = function(){
		this.toastArr = [];
	};

	ToastService.prototype.show = function( obj ){
		var text = obj.text;
		var html = obj.html;
		var tit = obj.tit;
		var controller = obj.controller;
		var _this = this;
		ModalService.showPopup({
			templateUrl: html || 'views/popup/toast_pop.html',
			controller: controller || 'toastPopController',
			id : $.getUUID(),
		}).then(function(modal) {

			modal.element.css({ top : _this.getToastTarTop( _this.toastArr.length ) + 50 });
			_this.toastArr.push( modal.element );

			_this.toastMove();
			modal.controller.setText( text );
			if( tit !== undefined && tit !== null ) modal.controller.setTitle( tit );
			
			setTimeout(function(){
				modal.element.remove();
				for( var i = 0; i<_this.toastArr.length; i++ ){
					if( _this.toastArr[i].attr('id') == modal.element.attr('id') ){
						_this.toastArr.splice( i, 1 );
						break;
					}
				}	
				_this.toastMove();	
				
			}, 3000);
		});
	};

	ToastService.prototype.toastMove = function(){
		for( var i = 0; i<this.toastArr.length; i++ ){
			tarTop = this.getToastTarTop(i);
			this.toastArr[i].stop().animate({top: tarTop, opacity: 1}, 500 );
		}
	};

	ToastService.prototype.getToastTarTop = function( i ){
		return 98 + i*120;
	};

	return ToastService;
});