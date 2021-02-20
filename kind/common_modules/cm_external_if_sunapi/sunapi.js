function Sunapi(settings) {
    this.setSettings = function(settings){
        if(!settings){
            return;
        }
        this.url = settings.url;
        this.cgi = settings.cgi;
        this.msubmenu = settings.msubmenu;
        this.action = settings.action;
        this.param = settings.param;

        // Temporary variables caused by origin Issue of SUMAPI.
        this.echo_sunapi_server = settings.echo_sunapi_server;
        this.user = settings.user;          
        this.password = settings.password;    
    }

    this.setParam = function(param){
        this.param = param;
    }
    this.changeCgi = function(cgi){
        this.cgi = cgi;
    }
    this.changeAction = function(action){
        this.action = action;
    }
    this.changeSubmenu = function(menu) {
        this.msubmenu = menu;
    }
    this.getUrl = function(){ 
        var path = "http://"+this.url+"/stw-cgi/"+this.cgi+"?msubmenu="+this.msubmenu+"&action="+this.action;
        var param_url = "";
        if(this.param){
            for(var param_name in this.param){
              param_url += (param_name)?"&"+param_name+"="+this.param[param_name]:"";   
            }
        }
        else{
            param_url += "";
        }
        return path + param_url;
    }
    this.toString = function(){
        console.log(this.getUrl()); 
    }
    this.commit = function(successFunction){
        $.ajax({
            url : this.getUrl(),
            type: "GET",
            success : successFunction,
            error : function(request) {
                console.log("Failed : KindStreamManager can not get the url of streamer!");
            }
        });
    },

    
        
    // Temporary function caused by origin Issue of SUMAPI.
    this.commitTempSunapi = function(successFunction){
        var element = 'elements';
        $.ajax({
            async:false,
            url : "http://"+this.echo_sunapi_server+"/sunapi",
            type: "POST",
            data: {"user": this.user, "password": this.password, "url": this.getUrl()},
            success : successFunction,
            error : function(request) {
                console.log("Failed : KindStreamManager can not get the url of streamer!");
            }
        });
    }      
    
    // Temporary function caused by origin Issue of SUMAPI.
    this.commitTempSunapiBase64 = function(successFunction){
        var element = 'elements';
        $.ajax({
            async:false,
            url : "http://"+this.echo_sunapi_server+"/sunapi/base64",
            type: "POST",
            data: {"user": this.user, "password": this.password, "url": this.getUrl()},
            success : successFunction,
            error : function(request) {
                console.log("Failed : KindStreamManager can not get the url of streamer!");
            }
        });
    } 
    this.setSettings(settings);
    
};

    

