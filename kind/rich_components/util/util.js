// Add this directive where you keep your directives
kindFramework.directive('onPress', function($timeout) {
	return {
		restrict: 'A',
		link: function($scope, $elm, $attrs) {
			
			var timer = null;
			$elm.bind('mousedown', function(evt) {
				// Locally scoped variable that will keep track of the long press
				$scope.pressContinue = true;
 
				// We'll set a timeout for 600 ms for a long press
				timer = setInterval(function() {
					if ($scope.pressContinue) {
						// If the touchend event hasn't fired,
						// apply the function given in on the element's on-long-press attribute
						$scope.$apply(function() {
							$scope.$eval($attrs.onPress)
						});
					}
				}, 60);
			});
 
			$elm.bind('mouseup', function(evt) {
				// Prevent the onLongPress event from firing
				$scope.pressContinue = false;
				clearInterval(timer);
				// If there is an on-touch-end function attached to this element, apply it
				if ($attrs.pressContinue) {
					$scope.$apply(function() {
						$scope.$eval($attrs.ngMouseup)
					});
				}
			});
		}
	};
})

kindFramework.directive('myTouchstart', [function() {
                return function(scope, element, attr ) {
					
					var eventName = $.isMobile() ? 'touchstart' : 'mousedown';
                    element.on(eventName, function(event) {
                        scope.$apply(function() { 
                            scope.$eval(attr.myTouchstart); 
                        });
                    });
					
                };
            }]).directive('myTouchend', [function() {
                return function(scope, element, attr) {

					var eventName = $.isMobile() ? 'touchend' : 'mouseup';
                    element.on(eventName, function(event) {
                        scope.$apply(function() { 
                            scope.$eval(attr.myTouchend); 
                        });
                    });
                };
            }]);

/*
* jquery
*/
(function ($) {
	$.fn.kindClick = function (onclick) {
        this.bind("touchstart", function (e) { onclick.call(this, e); e.stopPropagation(); e.preventDefault(); });
        this.bind("click", function (e) { onclick.call(this, e); });   //substitute mousedown event for exact same result as touchstart         
        return this;
    };
    $.fn.kindDown = function (mousedown) {
        this.bind("touchstart", function (e) { mousedown.call(this, e); e.stopPropagation(); e.preventDefault(); });
        this.bind("mousedown", function (e) { mousedown.call(this, e); });   //substitute mousedown event for exact same result as touchstart         
        return this;
    };
    $.fn.kindUp = function (mouseup) {
        this.bind("touchend", function (e) { mouseup.call(this, e); e.stopPropagation(); e.preventDefault(); });
        this.bind("mouseup", function (e) { mouseup.call(this, e); });   //substitute mousedown event for exact same result as touchstart         
        return this;
    };
    $.fn.kindMove = function (mousemove) {
        this.bind("touchmove", function (e) { mousemove.call(this, e); e.stopPropagation(); e.preventDefault(); });
        this.bind("mousemove", function (e) { mousemove.call(this, e); });   //substitute mousedown event for exact same result as touchstart         
        return this;
    };
})(jQuery);