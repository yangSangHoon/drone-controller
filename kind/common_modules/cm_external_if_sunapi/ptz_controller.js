
var PtzController = (function (settings) {
    function constructor(settings) {
        this.unitSize = settings.unitSize;
        this.ptz_param = {
            Pan: 0.0,
            Tilt: 0.0,
            ZoomPulse: 0.0
        };
        
        var sunapiSettings = {
            url:        settings.cameraUrl,
            cgi:        'ptzcontrol.cgi',
            msubmenu:   'relative',
            action:     'control',
            param:      this.ptz_param,

            // Temporary parameters caused by origin Issue of SUMAPI.
            echo_sunapi_server:settings.echo_sunapi_server,
            user:       settings.user,
            password:   settings.password
        };
        
        this.ptz_sunapi = new Sunapi(sunapiSettings);
    };
    
    constructor.prototype = {
        left:function(){
            this.ptz_param.Pan = this.unitSize;
            this.ptz_param.Tilt = 0.0;
            this.ptz_param.ZoomPulse = 0.0;
            this.ptz_sunapi.setParam(this.ptz_param);
            this.ptz_sunapi.commitTempSunapi(this.successCallback.bind(this));
        },
        right:function(){
            this.ptz_param.Pan = -this.unitSize;
            this.ptz_param.Tilt = 0.0;
            this.ptz_param.ZoomPulse = 0.0;
            this.ptz_sunapi.setParam(this.ptz_param);
            this.ptz_sunapi.commitTempSunapi(this.successCallback.bind(this));
        },
        up:function(){
            this.ptz_param.Pan = 0.0;
            this.ptz_param.Tilt = this.unitSize;
            this.ptz_param.ZoomPulse = 0.0;
            this.ptz_sunapi.setParam(this.ptz_param);
            this.ptz_sunapi.commitTempSunapi(this.successCallback.bind(this));
        },
        down:function(){
            this.ptz_param.Pan = 0.0;
            this.ptz_param.Tilt = -this.unitSize;
            this.ptz_param.ZoomPulse = 0.0;
            this.ptz_sunapi.setParam(this.ptz_param);
            this.ptz_sunapi.commitTempSunapi(this.successCallback.bind(this));
        },
        zoomIn:function(){
            this.ptz_param.Pan = 0.0;
            this.ptz_param.Tilt = 0.0;
            this.ptz_param.ZoomPulse = this.unitSize * 10;
            this.ptz_sunapi.setParam(this.ptz_param);
            this.ptz_sunapi.commitTempSunapi(this.successCallback.bind(this));
        },
        zoomOut:function(){
            this.ptz_param.Pan = 0.0;
            this.ptz_param.Tilt = 0.0;
            this.ptz_param.ZoomPulse = -this.unitSize * 10;
            this.ptz_sunapi.setParam(this.ptz_param);
            this.ptz_sunapi.commitTempSunapi(this.successCallback.bind(this));
        },
        successCallback: function(data){
            console.log(data);
        }
    };

    return constructor;
})();



/*
var ProfileController = function{
constructor
{
    var media_param = {

    };
sunapiSettings.cgi = 'media.cgi';
    sunapiSettings.msubmenu = 'videoprofile';
    sunapiSettings.action = 'view';
    sunapiSettings.param = media_param;    
    var media_view = new Sunapi(sunapiSettings);
    
    
sunapiSettings.cgi = 'media.cgi';
    sunapiSettings.msubmenu = 'videoprofile';
    sunapiSettings.action = 'control';
    sunapiSettings.param = media_param;    
    var media_createe = new Sunapi(sunapiSettings);
}

prifilecontrol.protop {
getProfileList:fucntion(){

    
    media_view.commitTempSunapi(function(data){console.log(data);});
}
creatProfiol:
  md_cretate.commit
}
}

ProCtl.getPro
P.creatPro
*/




