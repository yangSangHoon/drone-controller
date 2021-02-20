var parseProfile = function (data) {
    var camera = {},
        profile = {},
        subData = {};
    var id = null,
        subid = null;
    var split,
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
