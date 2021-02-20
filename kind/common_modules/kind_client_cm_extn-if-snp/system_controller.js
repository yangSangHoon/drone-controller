/**
 * KindSystemService can get the device information from camera.
 *
 * @class   KindSystemService
 * @example 
 * var settings = {
 *      cameraUrl: "[192.168.xxx.xxx]",
 *      echo_sunapi_server:["" or "55.101.78.176:5000"],
 *      user:"[user id]",
 *      password:"[password]"
 * };
 *        
 * KindSystemService.setDeviceConnectionInfo(settings);
 * KindSystemService.getDeviceInfo()
 * .then(function(data){
 *  // handle data            
 *  });
 */
kindSunapi
.factory("KindSystemService", function(KindSunapiService, $q){
    return function(){
        var self = this;
        this.__proto__ = new KindSunapiService();
        
        var generateJson = function(data){
            var parser = new BasicSunapiParser();
            return parser.parseLine(data);
        };

        var setDeviceConnectionInfo = function(settings){
            self.setSettings(settings);
        };

        var getDeviceInfo = function(){
            self.changeCgi('system.cgi');
            self.changeSubmenu('deviceinfo');
            self.changeAction('view');

            var deferred = $q.defer();
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

        var isPtzDevice = function(){
            var deferred = $q.defer();
            getDeviceInfo().then(function(data){
                deferred.resolve(
                    data.hasOwnProperty('PTZBoardVersion')
                );
            },function(data){
                deferred.reject(data);
            });
            return deferred.promise;
        };

        return {
            setDeviceConnectionInfo:setDeviceConnectionInfo,
            getDeviceInfo:getDeviceInfo,
            isPtzDevice:isPtzDevice
        }
    }
});