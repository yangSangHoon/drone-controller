var app = {
	
	// Check if app is running on browser on device
    setDevice: function () {
        window.isPhone = false;
        var documentUrl = document.URL;
        
        if (documentUrl.indexOf("http://") === -1 && documentUrl.indexOf("https://") === -1) {
            window.isPhone = true;
        }
        return window.isPhone;
    },
	
    // Application Constructor
    initialize: function() {
        this.setDevice();
        

        angular.bootstrap(document, ['kindFramework']);
        
        $('body > div').css( 'visibility', 'visible' );

        /*if(window.isPhone){
            this.bindEvents();
        }else{
            this.onDeviceReady();
        }*/

        document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
    },
	
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
		console.log('bindEvents..');
		document.addEventListener('deviceready', this.onDeviceReady, false);
		/*angular.bootstrap(document, ['kindFramework']);
		window.plugins.html5Video.initialize( { "frontVideo":"./images/small.mp4", "subVideo":"http://192.168.123.9:3303/files/sub.mp4" } ) */
    },
	
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		console.log('onDeviceReady..');
		if( window.plugins !== undefined ){
			window.plugins.html5Video.initialize( { "frontVideo":"front.mp4",  "subVideo":"sub.mp4"} );
		}
		angular.bootstrap(document, ['kindFramework']);
		
    }
};

//browser detect
var browserSurpport = (function() {
  var s = navigator.userAgent.toLowerCase();
  var match = /(webkit)[ \/](\w.]+)/.exec(s) ||
              /(opera)(?:.*version)?[ \/](\w.]+)/.exec(s) ||
              /(msie) ([\w.]+)/.exec(s) ||               
              /(mozilla)(?:.*? rv:([\w.]+))?/.exec(s) ||
             [];
  return { name: match[1] || "", version: match[2] * 1 || 0 };
}());

function init(){
	// uesing
	if(browserSurpport.name == 'msie' && browserSurpport.version < 9){
		var html = [
			'<div class="container">',
				'<div class="alert alert-info" role="alert">',
					'This Web Site have used the <strong>HTML5 Standard</strong> Technology. Please upgrade the browser that can be surport and restart.',
					'<br />',
					'<br />',
					'<a href="http://windows.microsoft.com/ko-kr/internet-explorer/download-ie/" class="btn btn-primary btn-sm" target="_blank">',
						'Internet Explorer',
					'</a>&nbsp;',

					'<a href="http://www.mozilla.or.kr/ko/firefox/new/" class="btn btn-warning btn-sm" target="_blank">',
						'FireFox',
					'</a>&nbsp;',

					'<a href="http://www.google.com/intl/ko/chrome/browser/" class="btn btn-success btn-sm" target="_blank">',
						'Chrome',
					'</a>&nbsp;',

					'<a href="http://support.apple.com/kb/DL1531?viewlocale=ko_KR&amp;locale=ko_KR/" class="btn btn-info btn-sm" target="_blank">',
						'Safari',
					'</a>&nbsp;',

					'<a href="http://www.opera.com/ko/computer/" class="btn btn-danger btn-sm" target="_blank">',
						'Opera',
					'</a>',
				'</div>',
			'</div>'
		];
		document.body.innerHTML = html.join('');
		document.title = "Please upgrade the browser";
	}else{
		app.initialize();
	}
}
