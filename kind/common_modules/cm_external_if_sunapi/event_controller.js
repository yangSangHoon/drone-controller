var EventController = (function(settings){
    function constructor(settings){
        var today = new Date();
        var months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
        var date = (today.getDate() < 10)?"0"+today.getDate():today.getDate();
        var defaultDay = today.getFullYear()+"-"+months[today.getMonth()]+"-"+date;

        this.event_param = {
            Type:       'All',
            FromDate:   defaultDay + ' 00:00:01',
            ToDate:     defaultDay + ' 23:59:59'
        };
        
        if(settings) {
            var sunapiSettings = {
                url:        settings.cameraUrl,

                // Temporary parameters caused by origin Issue of SUMAPI.
                echo_sunapi_server:settings.echo_sunapi_server,
                user:       settings.user,  
                password:   settings.password
            }
            this.event_sunapi = new Sunapi(sunapiSettings);        
        }
        else{
            this.event_sunapi = new Sunapi();
        }
        
        this.parser = new DateParser();
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
            this.event_sunapi.setSettings(sunapiSettings);
        },
        getEventList:function(condition){
            var responseElement = '';
            this.event_sunapi.changeCgi('recording.cgi');
            this.event_sunapi.changeSubmenu('timeline');
            this.event_sunapi.changeAction('view');
            this.event_sunapi.setParam(this.event_param);
            
            if(condition)
                this.event_sunapi.setParam(condition);
            this.event_sunapi.commitTempSunapi(function(data){
                responseElement = data; 
            });
            
//            return parseDate(parseSunapi(responseElement));
            return this.parser.parseLine(responseElement);
        }
    }
    
    return constructor;

})();
