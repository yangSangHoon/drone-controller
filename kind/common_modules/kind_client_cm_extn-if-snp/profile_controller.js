/**
 * KindProfileService can get the profile list or snapshot from camera.
 *
 * @class   KindProfileService
 * @example 
 * var settings = {
 *      cameraUrl: "192.168.xxx.xxx",
 *      echo_sunapi_server:["" or "55.101.78.176:5000"],
 *      user:"userid",
 *      password:"password",
 * };
 *        
 * KindProfileService.setDeviceConnectionInfo(settings);
 * KindProfileService.getProfileList()
 * .then(function(data){
 *  // handle data            
 *  });
 */
kindSunapi
.factory("KindProfileService", function(KindSunapiService, $q){
    return function(){
        var profile_param = {};
        var self = this;
        this.__proto__ = new KindSunapiService();
        
        var generateJson = function(data){
            var parser = new ProfileParser();
            return parser.parseLine(data);
        };

        var setDeviceConnectionInfo = function(settings){
            self.setSettings(settings);
        };
        
        var getProfileList = function(profile, channel){
            var deferred = $q.defer();

            if(!self.isNull(profile)){
                profile_param.Profile = profile;
            }

            if(!self.isNull(channel)){
                profile_param.Channel = channel;
            }

            self.changeCgi('media.cgi');
            self.changeSubmenu('videoprofile');
            self.changeAction('view');
            self.changeParam(profile_param);
            self.commit()
                .then(function(response){ 
                    self.checkVersion() ? 
                        deferred.resolve(response.data) : 
                        response.data.indexOf('401 - Unauthorized') != -1 || self.isNull(response.data) ? 
                            deferred.reject(response.data) : 
                            deferred.resolve(generateJson(response.data));
                },function(response){
                    deferred.reject(response.data);
            });

            return deferred.promise;
        };
            
        var getSnapshot = function(){
            var fr = new FileReader();
            var deferred = $q.defer();            

            self.changeCgi('video.cgi');
            self.changeSubmenu('snapshot');
            self.changeAction('view');
            self.commit({responseType:'blob'})
            .then(function(response){

                if(self.checkVersion()){
                    fr.onload = function(){
                        deferred.resolve(
                            "data:image/jpeg;base64,"+ window.btoa(fr.result)
                        );
                    };
                    fr.readAsBinaryString(response.data);
                }
                else{
                    window.atob(response.data).indexOf('401 - Unauthorized') != -1 || self.isNull(response.data) ? 
                        deferred.reject(response.data) : 
                        deferred.resolve("data:image/jpeg;base64,"+ response.data);
                }
            },
             function(response){
                deferred.reject(response.data);
            });

            return deferred.promise;
        };

        return {
            setDeviceConnectionInfo:setDeviceConnectionInfo,
            getProfileList:getProfileList,
            getSnapshot:getSnapshot,
            createProfile:function(){
                //TODO
            }
        };
    }
});