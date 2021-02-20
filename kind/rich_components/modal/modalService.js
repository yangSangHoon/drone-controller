kindFramework.service('ModalService', ['$document', '$compile', '$controller', '$http', '$rootScope', '$q', '$templateCache',
    function($document, $compile, $controller, $http, $rootScope, $q, $templateCache) {

    var body = $document.find('body');

	var self = this;
	var popupIdList = [];

	var getTemplate = function(template, templateUrl) {
		var deferred = $q.defer();
		if(template) {
			deferred.resolve(template);
		} else if(templateUrl) {
			var cachedTemplate = $templateCache.get(templateUrl);
			if(cachedTemplate !== undefined) {
				deferred.resolve(cachedTemplate);
			}
			else {
				$http({method: 'GET', url: templateUrl, cache: true})
				.then(function(result) {
					$templateCache.put(templateUrl, result.data);
					deferred.resolve(result.data);
				}, function(error) {
					deferred.reject(error);
				});
			}
		} else {
			deferred.reject("No template or templateUrl has been specified.");
		}
		return deferred.promise;
    	};
	
	self.allClose = function(id){
		if( id == null ){
			for( var i = 0; i<popupIdList.length; i++ ){
				$( "#" + popupIdList[i] ).remove();
			}
		}else{
			var index = popupIdList.indexOf(id)
			removeId(index);
		}
	}
	
	self.showModal = function(options) {
		options.isModal = true;
		return self.show(options);
	};
	
	self.showPopup = function(options) {
		if( checkpopupId(options.id) == -1 ){
			return self.show(options);
		}
	};
	
	var checkpopupId = function( id ){
		if( id === undefined ) return;
		var index = popupIdList.indexOf( id );
		if( index > -1 ){
			removeId(index);
		}else{
			popupIdList.push( id );
		}
		return index;
	}
	
	var removeId = function(index){
		var savedId = popupIdList[index];
		$("#" + savedId ).remove();
		popupIdList.splice(index,1);
	}

	self.show = function(options) {
		
		var deferred = $q.defer();

		var controllerName = options.controller;
		if(!controllerName) {
			deferred.reject("No controller has been specified.");
			return deferred.promise;
		}

	
		if(options.controllerAs) {
			controllerName = controllerName + " as " + options.controllerAs;
		}

		getTemplate(options.template, options.templateUrl)
		.then(function(template) {

			//  Create a new scope for the modal.
			var modalScope = $rootScope.$new();

			//  Create the inputs object to the controller - this will include
			//  the scope, as well as all inputs provided.
			//  We will also create a deferred that is resolved with a provided
			//  close function. The controller can then call 'close(result)'.
			//  The controller can also provide a delay for closing - this is
			//  helpful if there are closing animations which must finish first.
			var closeDeferred = $q.defer();
			var inputs = {
				$scope: modalScope,
				close: function(result, delay) {
					if(delay === undefined || delay === null) delay = 0;
					//window.setTimeout(function() {
					  //  Resolve the 'close' promise.
						var index = popupIdList.indexOf( options.id );
						if( index > -1 ){
							savedId = popupIdList[index];
							popupIdList.splice(index,1);
							$("#" + options.id).remove(); 
						}
			
						closeDeferred.resolve(result);

						//  We can now clean up the scope and remove the element from the DOM.
						modalScope.$destroy();
						modalElement.remove();

						//  Unless we null out all of these objects we seem to suffer
						//  from memory leaks, if anyone can explain why then I'd 
						//  be very interested to know.
						inputs.close = null;
						deferred = null;
						closeDeferred = null;
						modal = null;
						inputs = null;
						modalElement = null;
						modalScope = null;
					//}, delay);
				}
			};

			//  If we have provided any inputs, pass them to the controller.
			if(options.inputs) {
				for(var inputName in options.inputs) {
					inputs[inputName] = options.inputs[inputName];
				}
			}
			
			//  Parse the modal HTML into a DOM element (in template form).
			//var modalElementTemplate = angular.element(template);

			var modalElementTemplate;
			if( options.isModal ){
				modalElementTemplate = $('<div class="modal_wrap"></div>');
				var con = $('<div class="modal_con"></div>');
				if( options.css != null ) con.css(options.css);
				var btn = $('<a class="modal_close"></a>');
				var temp = angular.element(template);

				btn.click(function(){
					inputs.close();
				});

				//if( options.noBtn == null ) con.append(btn);
				con.append(temp);
				modalElementTemplate.append(con);
			}else{
				modalElementTemplate = angular.element(template);
				if( options.position ){
					modalElementTemplate.css(options.position);
				}
				if( options.id ){
					modalElementTemplate.attr('id', options.id );
				}
			}
			
			//  Compile then link the template element, building the actual element.
			//  Set the $element on the inputs so that it can be injected if required.
			var linkFn = $compile(modalElementTemplate);
			var modalElement = linkFn(modalScope);
			inputs.$element = modalElement;

			//  Create the controller, explicitly specifying the scope to use.
			var modalController = $controller(controllerName, inputs);

			//  Finally, append the modal to the dom.
			if (options.appendElement) {
				// append to custom append element
				options.appendElement.append(modalElement);
			} else {
				// append to body when no custom append element is specified
				body.append(modalElement);
			}
			//body.append(modalElement);

			if( options.animate !=  null ){
				modalElement.animate( options.animate, options.animateSpeed || 500 );	
			}
			

			//  We now have a modal object...
			var modal = {
				controller: modalController,
				scope: modalScope,
				element: modalElement,
				close: closeDeferred.promise
			};

			//  ...which is passed to the caller via the promise.
			deferred.resolve(modal);
		})
		.then(null, function(error) { // 'catch' doesn't work in IE8.
			deferred.reject(error);
		});

		return deferred.promise;
	};

}]);
