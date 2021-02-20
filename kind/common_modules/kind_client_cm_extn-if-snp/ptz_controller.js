/**
 * KindPTZService can control PAN, TILT and ZOOM of camera.
 *
 * @class   KindPTZService
 * @example 
 * var settings = {
 *      cameraUrl: "192.168.xxx.xxx",
 *      echo_sunapi_server:["" or "55.101.78.176:5000"],
 *      user:"userid",
 *      password:"password",
 *      options:{
 *          unitSize:3.0,   // optional
 *          pulseSize:20    // optional
 *      }
 * };
 *        
 * KindPTZService.setDeviceConnectionInfo(settings);
 * KindPTZService.left();
 */
kindSunapi
.factory("KindPTZService", function(KindSunapiService, $q){
    return function(){
        var unitSize = 3.0;
        var pulseSize =  20;//Temporary Magic Number
        var ptz_param = {
                Pan: 0.0,
                Tilt: 0.0,
                ZoomPulse: 0.0
        };
        var sunapiSettings;

        var self = this;
        this.__proto__ = new KindSunapiService();

        var setDeviceConnectionInfo = function(settings){
            if(!self.isNull(settings.options)) {
                if(!self.isNull(settings.options.unitSize)){
                    unitSize = settings.options.unitSize;
                }
                if(!self.isNull(settings.options.pulseSize)) {
                    pulseSize = settings.options.pulseSize;
                }
            }

            self.setSettings(settings);
            self.changeCgi('ptzcontrol.cgi');
            self.changeSubmenu('relative');
            self.changeAction('control');
            self.changeParam(ptz_param);

        };

        var setPTZValue = function(p, t, z){
            ptz_param.Pan = p;
            ptz_param.Tilt = t;
            ptz_param.ZoomPulse = z;
            self.changeSubmenu('relative');
        };

        var run = function(){
            var deferred = $q.defer();
            self.commit().then(function(response){   
                response.data.indexOf('401 - Unauthorized') != -1 || self.isNull(response.data) ? 
                    deferred.reject(response.data) : 
                    deferred.resolve(response.data);
            },function(response){
                deferred.resolve(response.data);
            });
            return deferred.promise;
        };

        var left = function(){
            setPTZValue(unitSize, 0.0, 0.0);
            self.changeParam(ptz_param);
            return run();
        };

        var right = function(){
            setPTZValue(-unitSize, 0.0, 0.0);
            self.changeParam(ptz_param);
            return run();
        };

        var up = function(){
            setPTZValue(0.0, unitSize, 0.0);
            self.changeParam(ptz_param);
            return run();
        };

        var down = function(){
            setPTZValue(0.0, -unitSize, 0.0);
            self.changeParam(ptz_param);
            return run();
        };

        var zoomIn = function(){
            setPTZValue(0.0, 0.0, unitSize * pulseSize);
            self.changeParam(ptz_param);
            return run();
        };

        var zoomOut = function(){
            setPTZValue(0.0, 0.0, -unitSize * pulseSize);
            self.changeParam(ptz_param);
            return run();
        };

        var areaZoomIn = function(x1,y1,x2,y2, tileWidth, tileHeight){
            var areaZoomParam = {
                Type:'ZoomIn',
                X1:x1,
                X2:x2,
                Y1:y1,
                Y2:y2
            };

            if(!self.isNull(tileWidth) && !self.isNull(tileHeight)){
                areaZoomParam.TileWidth = tileWidth;
                areaZoomParam.TileHeight = tileHeight;
            }

            self.changeParam(areaZoomParam);
            self.changeSubmenu('areazoom');
            return run();        
        };

        var areaZoomOut = function(){
            var areaZoomParam = {
                Type:'1x'
            };
            self.changeParam(areaZoomParam);
            self.changeSubmenu('areazoom');
            return run();
        };

        var setNearFarStop = function(nfs){
            var focusParam = {
                Focus:nfs
            }
            self.changeParam(focusParam);
            self.changeSubmenu('continuous');
        };

        var near = function(){
            setNearFarStop('Near');
            return run();
        };


        var far = function(){
            setNearFarStop('Far');
            return run();
        };

        var focusStop = function(){
            setNearFarStop('Stop');
            return run();
        };

        return {
            near:near,
            far:far,
            focusStop:focusStop,
            areaZoomIn:areaZoomIn,
            areaZoomOut:areaZoomOut,
            setDeviceConnectionInfo:setDeviceConnectionInfo,
            left:left,
            right:right,
            up:up,
            down:down,
            zoomIn:zoomIn,
            zoomOut:zoomOut
        };
    }
});