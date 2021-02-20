/**
 * KindAudioService can control audio of camera.
 * 
 * @class   KindAudioService
 * @example 
 * var settings = {
 *      cameraUrl: "192.168.xxx.xxx",
 *      echo_sunapi_server:"" or "55.101.78.176:5000",
 *      user:"userid",
 *      password:"password"
 * };
 *        
 * KindAudioService.setDeviceConnectionInfo(settings);
 * KindAudioService.volume(7)
 * .then(function(data){
 *  // handle data            
 *  });
 */

kindSunapi
.factory("KindAudioService", function(KindSunapiService, $q){
    return function(){
        var self = this;
        this.__proto__ = new KindSunapiService();
    
        var setDeviceConnectionInfo = function(settings){
            self.setSettings(settings);
            self.changeCgi('media.cgi');
            self.changeSubmenu('audiooutput');        
        };

        var generateJson = function(data){
            var parser = new AudioOutputParser();
            return parser.parseLine(data);
        };

        var run = function(){
            var deferred = $q.defer();
            self.commit().then(function(response){   
                deferred.resolve(
                    response.data
                );
            });
            return deferred.promise;
        };

        var status = function() {
            var deferred = $q.defer();        
            self.changeAction('view');
            self.commit().then(function(response){   
                deferred.resolve(
                    self.checkVersion()?response.data:generateJson(response.data)
                );
            });
            return deferred.promise;
        };

        var on = function(){
            var param = {
                Enable : "True"
            };
            self.changeAction('set');
            self.changeParam(param);
            return run();
        };

        var volume = function(gain){
            var isEnable;
            if(gain > 0 && gain < 11){
                isEnable = "True";
            }
            else{
                isEnable = "False";
                gain = 0;
            }
            var param = {
                Enable : isEnable,
                Gain:gain
            };
            self.changeAction('set');
            self.changeParam(param);
            return run();
        };

        var mute = function(){
            var param = {
                Enable : "False"
            };
            self.changeAction('set');
            self.changeParam(param);
            return run();
        };


        return {
            status:status,
            on:on,
            volume:volume,
            mute:mute,
            setDeviceConnectionInfo:setDeviceConnectionInfo
        };
    }
});