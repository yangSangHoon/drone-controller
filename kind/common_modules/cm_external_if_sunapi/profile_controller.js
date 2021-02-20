var ProfileController = (function(settings){
    function constructor(settings){
        if(settings) {
            var sunapiSettings = {
                url:        settings.cameraUrl,

                // Temporary parameters caused by origin Issue of SUMAPI.
                echo_sunapi_server:settings.echo_sunapi_server,
                user:       settings.user,
                password:   settings.password
            }
            
            this.profile_sunapi = new Sunapi(sunapiSettings);
        }
        else{
            this.profile_sunapi = new Sunapi();
        }
        this.parser = new ProfileParser();
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
            this.profile_sunapi.setSettings(sunapiSettings);
        },
        getProfileList:function(){
            var responseElement = '';
            
            this.profile_sunapi.changeCgi('media.cgi');
            this.profile_sunapi.changeSubmenu('videoprofile');
            this.profile_sunapi.changeAction('view');
            this.profile_sunapi.commitTempSunapi(function(data){
                responseElement = data; 
            });
//            console.log(responseElement);
//            return parseProfile(responseElement);
            return this.parser.parseLine(responseElement);
        },
        createProfile:function(){
            
        },
        getSnapshot:function(){
            var jpeg = '';
            var param = {
            }
            this.profile_sunapi.changeCgi('video.cgi');
            this.profile_sunapi.changeSubmenu('snapshot');
            this.profile_sunapi.changeAction('view');
            this.profile_sunapi.commitTempSunapiBase64(function(data){
                jpeg = data;
            });
            
            return jpeg;
        },
        getSnapshotUri:function(){
            this.profile_sunapi.changeCgi('video.cgi');
            this.profile_sunapi.changeSubmenu('snapshot');
            this.profile_sunapi.changeAction('view');
            
            return this.profile_sunapi.getUrl();
        }
        
    }

    return constructor;

})();
