/**
 * KindEventService can get the event information list from camera.
 *
 * @class   KindEventService
 * @example 
 * var settings = {
 *      cameraUrl: "192.168.xxx.xxx",
 *      echo_sunapi_server:["" or "55.101.78.176:5000"],
 *      user:"userid",
 *      password:"password",
 *      options:{
 *          Type:       ['All' or 'MotionDetection' or 'xx'],
 *          FromDate:   'YYYY-MM-DD HH:MM:SS',
 *          ToDate:     'YYYY-MM-DD HH:MM:SS'
 *      }
 * };
 *        
 * KindEventService.setDeviceConnectionInfo(settings);
 * KindEventService.getEventList()
 * .then(function(data){
 *  // handle data            
 *  });
 */
kindSunapi
.factory("KindEventService", function(KindSunapiService, $q){
    return function(){
        var self = this;
        this.__proto__ = new KindSunapiService();
        
        var today = new Date();
        var months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
        var date = (today.getDate() < 10)?"0"+today.getDate():today.getDate();
        var defaultDay = today.getFullYear()+"-"+months[today.getMonth()]+"-"+date;

        var event_param = {
            Type:       'All',
            FromDate:   defaultDay + ' 10:00:01',
            ToDate:     defaultDay + ' 23:59:59'
        };

        var generateJson = function(data){
            var parser = new DateParser();
            return parser.parseLine(data);
        };

        var setDeviceConnectionInfo = function(settings){
            self.setSettings(settings);
            if(!self.isNull(settings.options)) {
                self.changeParam(settings.options);
                event_param = settings.options;
            }
        };

        var getEventList = function(condition){
            self.changeCgi('recording.cgi');
            self.changeSubmenu('timeline');
            self.changeAction('view');
            if(self.isNull(condition)) {
                self.changeParam(event_param);
            }
            else{
                self.changeParam(condition);
            }

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
        }

        return {
            setDeviceConnectionInfo:setDeviceConnectionInfo,
            getEventList:getEventList
        }
    }
});