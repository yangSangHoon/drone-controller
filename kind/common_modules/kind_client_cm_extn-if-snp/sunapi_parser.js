function BasicSunapiParser() {
    this.jsonArray = [];
    this.json={};
    this.arrayIndex = 0;
    
    this.init = function(){
        this.jsonArray = {};
        this.arrayIndex = 0;
        this.json={};
    }

    this.parse = function (token) {
        var leftProperty = 0;
        var rightValue = 1;
        if(token[leftProperty]){
//            this.json[token[leftProperty]] = token[rightValue];
//            this.jsonArray[this.arrayIndex] = this.json;
            this.jsonArray[token[leftProperty]] = token[rightValue];
        }
        else{
            this.arrayIndex++;
        }
    }

    this.parseLine = function(data){
        var lines = data.split('\r\n');
        var lineIndex = 0;
        
        this.init();
        
        if(data.indexOf('NG') != -1 || data.indexOf('Error Code') != -1 || data.indexOf('Error Details') != -1 ){
            this.jsonArray = {
                Response:'Fail',
                Error:{
                    Code:Number(lines[1].split(": ")[1]),
                    Details:lines[3],
                }
            }
        }else{

            for(lineIndex = 0; lineIndex < lines.length; lineIndex++){
                var token = lines[lineIndex].split('=');
                this.parse(token);

            }
        }
        return this.jsonArray;
    }
    

}

function DateParser(){
    
    this.__proto__ = new BasicSunapiParser();
    
    var leftProperty = 0;
    var rightValue = 1;
    var oldIndex = 0;
    var channels = [];
    var results = [];
    var json = {};
    
    this.parse = function (token) {
        if(token[leftProperty]){
            var leftResult = token[leftProperty].split('.');
            var channel = leftResult[1];
            var arrIndex = leftResult[3];
            var propertyName = leftResult[4];
            var channelObj = {};
            
            if(arrIndex != oldIndex){
                json = {};
                oldIndex = arrIndex;
            }
            if (propertyName === 'StartTime' || propertyName === 'EndTime') {
                var strDatePattern = token[rightValue].replace(' ', 'T');
                token[rightValue] = new Date(strDatePattern).getTime()/1000;
            }
            json[propertyName] = token[rightValue];
            results[arrIndex] = json;
            channelObj.Results = results;
            channelObj.Channel = parseInt(channel);
            channels[channel] = channelObj;
            this.jsonArray['TimeLineSearchResults'] = channels;
        }
    }    
}

function ProfileParser(){
    
    this.__proto__ = new BasicSunapiParser();
    
    var leftProperty = 0;
    var rightValue = 1;
    var channels = [];
    var profiles = [];
    var json = {};
    var arrayIndex = 0;
    
    // Not tested for NVR. Only tested for cam.
    this.parse = function (token) {
        if(token[leftProperty]){
            var leftResult = token[leftProperty].split('.');
            var channel = leftResult[1];
            var profileIndex = leftResult[3];
            var propertyName = leftResult[4];
            var channelObj = {};

            json[propertyName] = token[rightValue];
            profiles[arrayIndex] = json;
            channelObj.Profiles = profiles;
            channelObj.Channel = parseInt(channel);
            channels[channel] = channelObj;
            this.jsonArray['VideoProfiles'] = channels;
        }
        else{
            json = {};
            arrayIndex++;
        }
    }
}

function AlarmOutputParser(){
    this.__proto__ = new BasicSunapiParser();
    
    var leftProperty = 0;
    var rightValue = 1;
    var alarmOutputs = [];
    var json = {};
    var oldIndex = 0;
    
    this.parse = function (token) {
        if(token[leftProperty]){
            var leftResult = token[leftProperty].split('.');
            var alarmIndex = leftResult[1];
            var propertyName = leftResult[2];
            
            if(alarmIndex != oldIndex){
                json = {};
                oldIndex = alarmIndex;
            }

            json['AlarmOutput'] = parseInt(alarmIndex);
            json[propertyName] = token[rightValue];
            alarmOutputs[alarmIndex-1] = json;
            this.jsonArray['AlarmOutputs'] = alarmOutputs;
        }
    }
}

function AudioOutputParser(){
    this.__proto__ = new BasicSunapiParser();
    
    var leftProperty = 0;
    var rightValue = 1;
    var audioOutputs = [];
    var json = {};
    var oldIndex = 0;
    
    this.parse = function (token) {
        if(token[leftProperty]){
            var leftResult = token[leftProperty].split('.');
            var alarmIndex = leftResult[1];
            var propertyName = leftResult[2];
            
            if(alarmIndex != oldIndex){
                json = {};
                oldIndex = alarmIndex;
            }

            json['Channel'] = parseInt(alarmIndex);
            var strRValue = token[rightValue];
            // Bitrate is not number, it's enumeration.
            var rValue = (isNaN(strRValue)||(propertyName == "Bitrate"))?strRValue:parseInt(strRValue);
            if(rValue == "True"){
                rValue = true;
            }
            
            if(rValue == "False"){
                rValue = false;
            }
            json[propertyName] = rValue;
            audioOutputs[alarmIndex] = json;
            this.jsonArray['AudioOutputs'] = audioOutputs;
        }
    }
}

function OverlayParser(){
    this.__proto__ = new BasicSunapiParser();
    
    var leftProperty = 0;
    var rightValue = 1;
    var alarmOutputs = [];
    var json = {};
    var oldIndex = 0;
    
    this.parse = function (token) {
        if(token[leftProperty]){
            var leftResult = token[leftProperty].split('.');
            var alarmIndex = leftResult[1];
            var propertyName = leftResult[2];
            
            if(alarmIndex != oldIndex){
                json = {};
                oldIndex = alarmIndex;
            }

            json['Channel'] = parseInt(alarmIndex);
            var strRValue = token[rightValue];
            var rValue = isNaN(strRValue)?strRValue:parseInt(strRValue);
            if(rValue == "True"){
                rValue = true;
            }
            
            if(rValue == "False"){
                rValue = false;
            }
            json[propertyName] = rValue;
            alarmOutputs[alarmIndex-1] = json;
            this.jsonArray['Overlay'] = alarmOutputs;
        }
    }
}
