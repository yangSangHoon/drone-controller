/**
 * KindAlarmService can control output of alarm.
 *
 * @class   KindAlarmService
 * @example 
 * var settings = {
 *      cameraUrl: "192.168.xxx.xxx",
 *      echo_sunapi_server:"" or "55.101.78.176:5000",
 *      user:"userid",
 *      password:"password"
 * };
 *        
 * KindAlarmService.setDeviceConnectionInfo(settings);
 * KindAlarmService.output()
 * .then(function(data){
 *  // handle data            
 *  });
 */
kindSunapi
.factory("KindAlarmService", function(KindSunapiService, $q){
    return function(){
        var self = this;
        this.__proto__ = new KindSunapiService();
    
        var setDeviceConnectionInfo = function(settings){
            self.setSettings(settings);
            self.changeCgi('io.cgi');
            self.changeSubmenu('alarmoutput');        
        };

        var generateJson = function(data){
            var parser = new AlarmOutputParser();
            return parser.parseLine(data);
        };

        var run = function(){
            var deferred = $q.defer();
            self.commit().then(function(response){
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

        var status = function() {
            var deferred = $q.defer();        
            self.changeAction('view');
            self.commit().then(function(response){   
                self.checkVersion() ? 
                    deferred.resolve(response.data) : 
                    response.data.indexOf('401 - Unauthorized') != -1 || self.isNull(response.data) ? 
                        deferred.reject(response.data) : 
                        deferred.resolve(generateJson(response.data));
            },function(response){
                deferred.reject(response.data);
            });
            return deferred.promise;
        }
        var output = function(port, duration){
            var param = {};
            var propertyNameState = "AlarmOut1put."+port+".State";
            var propertyNameDuration = "AlarmOutput."+port+".ManualDuration"
            param[propertyNameState] = "On";
            param[propertyNameDuration] = "Always";
            if(!self.isNull(duration)){
                if(duration == 0){
                    param[propertyNameDuration] = "Always";
                }
                else{
                    param[propertyNameDuration] = duration+"s";
                }
            }

            self.changeAction('control');
            self.changeParam(param);
            return run();
        };

        var stopOutput = function(port){
            var param = {};
            var propertyNameState = "AlarmOutput."+port+".State";
            param[propertyNameState] = "Off";
            self.changeAction('control');
            self.changeParam(param);
            return run();
        };

        var setAlarmDuration = function(port, duration){
            var param = {};
            var propertyNameState = "AlarmOutput."+port+".IdleState";
            var propertyNameDuration = "AlarmOutput."+port+".ManualDuration"
            param[propertyNameState] = "NormallyOpen";
            param[propertyNameDuration] = "Always";
            if(!self.isNull(duration)){
                if(duration == 0){
                    param[propertyNameDuration] = "Always";
                }
                else{
                    param[propertyNameDuration] = duration+"s";
                }
            }
            self.changeAction('set');
            self.changeParam(param);
            return run();
        };

        return {
            status:status,
            output:output,
            stopOutput:stopOutput,
            setAlarmDuration:setAlarmDuration,
            setDeviceConnectionInfo:setDeviceConnectionInfo
        };
    }
});