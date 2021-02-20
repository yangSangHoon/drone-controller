var parseSunapi = function (data) {
    var camera = {},
        profile = {},
        subData = {},
        id = null,
        subid = null,
        split,
        rowData,
        value,
        rowStart = 0;

    for (var i = 0; i < data.length; i++) {
        if (data[i] === '\r') {
            if (rowStart !== i) {
                split = data.slice(rowStart, i).split('=');

                value = split[1];
                rowData = split[0].split('.');

                if (id !== rowData[3]) {
                    if (id !== null) {
                        camera[id] = profile;
                        profile = {};
                    }
                    id = rowData[3];
                }

                if (rowData[5] === undefined) {
                    //if (rowData[5] != undefined) {
                    profile[rowData[4]] = value;
                    if (subid !== null) {
                        profile[subid] = subData;
                        subData = {};
                        subid = null;
                    }
                } else {
                    subid = rowData[4];
                    subData[rowData[5]] = value;
                }
            }
        } else if (data[i] === '\n') {
            rowStart = i + 1;
        }
    }

    if (subid !== null) {
        profile[subid] = subData;
    }
    camera[id] = profile;

    return camera;
};

var parseDate = function (data) {
    var parseData = data;
    
    for (var index in parseData) {
        if (index === 'undefined') {
            delete parseData[index];
        } else {
            for (var key in parseData[index]) {
                if (key === 'StartTime' || key === 'EndTime') {
                    var strDatePattern = parseData[index][key].replace(' ', 'T');
                    parseData[index][key] = new Date(strDatePattern).getTime()/1000;
                }
            }
        }
    }
    
    return parseData;
};

function BasicSunapiParser() {
    this.jsonArray = [];
    this.json={};
    this.arrayIndex = 0;
    
    this.init = function(){
        this.jsonArray = [];
        this.arrayIndex = 0;
        this.json={};
    }

    this.parse = function (token) {
        var leftProperty = 0;
        var rightValue = 1;
        if(token[leftProperty]){
            this.json[token[leftProperty]] = token[rightValue];
            this.jsonArray[this.arrayIndex] = this.json;
        }
        else{
            this.arrayIndex++;
        }
    }

    this.parseLine = function(data){
        var lines = data.split('\r\n');
        var lineIndex = 0;
        this.init();

        for(lineIndex = 0; lineIndex < lines.length; lineIndex++){
            var token = lines[lineIndex].split('=');
            this.parse(token);
        }
        return this.jsonArray;
    }
    

}

function DateParser(){
    var oldIndex = 0;
    this.__proto__ = new BasicSunapiParser();
    this.parse = function (token) {
        var leftProperty = 0;
        var rightValue = 1;

        if(this.arrayIndex == 0){
            this.arrayIndex++;
        }
        else if(token[leftProperty]){
            var leftResult = token[leftProperty].split('.');
            var propertyName = leftResult[4];
            var arrIndex = leftResult[3];
            if(arrIndex != oldIndex){
                this.json = {};
                oldIndex = arrIndex;
            }
            if (propertyName === 'StartTime' || propertyName === 'EndTime') {
                var strDatePattern = token[rightValue].replace(' ', 'T');
                token[rightValue] = new Date(strDatePattern).getTime()/1000;
            }
            this.json[propertyName] = token[rightValue];
            this.jsonArray[arrIndex] = this.json;
        }
    }    
}


function ProfileParser(){
    this.__proto__ = new BasicSunapiParser();
    this.parse = function (token) {
        var leftProperty = 0;
        var rightValue = 1;

        if(token[leftProperty]){
            var leftResult = token[leftProperty].split('.');
            var propertyName = leftResult[4];
            var profileIndex = leftResult[3];
            this.json['profileIndex'] = profileIndex;
            this.json[propertyName] = token[rightValue];
            this.jsonArray[this.arrayIndex] = this.json;
        }
        else{
            this.json = {};
            this.arrayIndex++;
        }
    }
}