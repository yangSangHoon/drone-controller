var SystemController = (function(settings){
    function constructor(settings){
        if(settings) {
        
            var sunapiSettings = {
                url:        settings.cameraUrl,

                // Temporary parameters caused by origin Issue of SUMAPI.
                echo_sunapi_server:settings.echo_sunapi_server,
                user:       settings.user,
                password:   settings.password
            }
            
            this.system_sunapi = new Sunapi(sunapiSettings);
        }
        else{
            this.system_sunapi = new Sunapi();
        }
        this.parser = new BasicSunapiParser();
    };
    
    constructor.prototype = {
        setDeviceConnectionInfo:function(settings){
            var sunapiSettings = {
                url:        settings.cameraUrl,

                // Temporary parameters caused by origin Issue of SUMAPI.
                echo_sunapi_server:settings.echo_sunapi_server,
                user:       settings.user,
                password:   settings.password
            }
            this.system_sunapi.setSettings(sunapiSettings);
        },
        getDeviceInfo:function(channel,profile){
            var responseElement = '';
            
            this.system_sunapi.changeCgi('system.cgi');
            this.system_sunapi.changeSubmenu('deviceinfo');
            this.system_sunapi.changeAction('view');
            this.system_sunapi.commitTempSunapi(function(data){
                responseElement = data;
            });
            return this.parser.parseLine(responseElement);
        },
        isPtzDevice:function(){
            var deviceInfo = this.getDeviceInfo();
            return deviceInfo[0].hasOwnProperty('PTZBoardVersion');
        }
    }

    return constructor;

})();
