/**
 * KindOverlayService can control overlay of camera.
 *
 * @class   KindOverlayService
 * @example 
 * var settings = {
 *      cameraUrl: "192.168.xxx.xxx",
 *      echo_sunapi_server:"" or "55.101.78.176:5000",
 *      user:"userid",
 *      password:"password"
 * };
 *        
 * KindOverlayService.setDeviceConnectionInfo(settings);
 * KindOverlayService.changeTimeOSD(0, 1, 2, true)
 * .then(function(data){
 *  // handle data            
 *  });
 */
kindSunapi
.factory("KindOverlayService", function(KindSunapiService, $q){
    return function(){
        var self = this;
        this.__proto__ = new KindSunapiService();
    
        var setDeviceConnectionInfo = function(settings){
            self.setSettings(settings);
            self.changeCgi('image.cgi');
            self.changeSubmenu('overlay');        
        };

        var generateJson = function(data){
            var parser = new OverlayParser();
            return parser.parseLine(data);
        };

        var run = function(){
            var deferred = $q.defer();
            self.commit().then(function(response){   
                response.data.indexOf('401 - Unauthorized') != -1 || self.isNull(response.data) ? 
                    deferred.reject(response.data) : 
                    deferred.resolve(response.data);
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
        };

        var setTitleOSDPosition = function(param, x, y){
            if( !self.isNull(x) && !self.isNull(y) ){   
                param['TitlePositionX'] = x;
                param['TitlePositionY'] = y;
            }
            return param
        };

        var setTitleOSDContent = function(param, title){
            param['Title'] = title;
            return param;        
        };

        var onTitleOSD = function(){
            var param = {
                TitleEnable : "True"
            };

            self.changeAction('set');
            self.changeParam(param);
            return run();
        };

        var offTitleOSD = function(){
            var param = {
                TitleEnable : "False"
            };

            self.changeAction('set');
            self.changeParam(param);
            return run();
        };    


        var changeTitleOSDPosition = function(x, y){
            var param = {
                TitleEnable : "True"
            };
            param = setTitleOSDPosition(param, x, y);

            self.changeAction('set');
            self.changeParam(param);
            return run();
        };

        var changeTitleOSDContent = function(title){
            var param = {
                TitleEnable : "True"
            };
            param = setTitleOSDContent(param, title);

            self.changeAction('set');
            self.changeParam(param);
            return run();
        };

        var changeTitleOSD = function(title, x, y){
            var param = {
                TitleEnable : "True"
            };
            param = setTitleOSDContent(param, title);
            param = setTitleOSDPosition(param, x, y);

            self.changeAction('set');
            self.changeParam(param);
            return run();
        };

        var setTimeOSDFormat = function(param, timeformat){
            var TimeFormatEnum = ["YYYY-MM-DD", "MM-DD-YYYY", "DD-MM-YYYY"];
            if( !((timeformat >= 0) && (timeformat <=3)) ){
                timeformat = 0;
            }
            param['TimeFormat'] = TimeFormatEnum[timeformat]
            return param;
        };

        var setTimeOSDPosition = function(param, x, y){
            if( !self.isNull(x) && !self.isNull(y) ){   
                param['TimePositionX'] = x;
                param['TimePositionY'] = y;
            }
            return param;
        };

        var setTimeOSDWeekday = function(param, weekday){
            var isWeekdayEnable;
            if( weekday === true ){
                isWeekdayEnable = "True";
            }
            else{
                isWeekdayEnable = "False";
            }
            param['WeekdayEnable'] = isWeekdayEnable;
            return param;
        };

        var onTimeOSD = function(){
            var param = {
                TimeEnable : "True"
            };

            self.changeAction('set');
            self.changeParam(param);
            return run();
        };

        var offTimeOSD = function(){
            var param = {
                TimeEnable : "False"
            };

            self.changeAction('set');
            self.changeParam(param);
            return run();
        };

        var changeTimeOSD = function(timeformat, x, y, weekday){
            var param = {
                TimeEnable : "True"
            };

            param = setTimeOSDFormat(param, timeformat);
            param = setTimeOSDPosition(param, x, y);
            param = setTimeOSDWeekday(param, weekday);       

            self.changeAction('set');
            self.changeParam(param);
            return run();
        };

        var changeTimeOSDPosition = function(x, y){
            var param = {
                TimeEnable : "True"
            };

            param = setTimeOSDPosition(param, x, y);

            self.changeAction('set');
            self.changeParam(param);
            return run();
        };

        var changeTimeOSDFormat = function(timeformat){
            var param = {
                TimeEnable : "True"
            };

            param = setTimeOSDFormat(param, timeformat);

            self.changeAction('set');
            self.changeParam(param);
            return run();
        };

        var changeTimeOSDWeekday = function(onOff){
            var param = {
                TimeEnable : "True"
            };

            param = setTimeOSDWeekday(param, onOff);  

            self.changeAction('set');
            self.changeParam(param);
            return run();
        };

        return {
            onTitleOSD:onTitleOSD,
            offTitleOSD:offTitleOSD,
            changeTitleOSDPosition:changeTitleOSDPosition,
            changeTitleOSDContent:changeTitleOSDContent,
            changeTitleOSD:changeTitleOSD,
            onTimeOSD:onTimeOSD,
            offTimeOSD:offTimeOSD,
            changeTimeOSD:changeTimeOSD,
            changeTimeOSDPosition:changeTimeOSDPosition,
            changeTimeOSDFormat:changeTimeOSDFormat,
            changeTimeOSDWeekday:changeTimeOSDWeekday,
            status:status,
            setDeviceConnectionInfo:setDeviceConnectionInfo
        };
    }
});