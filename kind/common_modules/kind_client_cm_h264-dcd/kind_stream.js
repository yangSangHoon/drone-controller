var CanvasManager = (function () {
    function constructor() {
        this.canvasContainer = {};

        var kind_canvas_list = document.querySelectorAll(".kind-stream-canvas");

        for (var i = 0; i < kind_canvas_list.length; i++) {
            // TODO : responsive size
            // kind_canvas_list[i].style.width = "100%";
            kind_canvas_list[i].style.height = "100%";

            this.canvasContainer[i] = kind_canvas_list[i];
        }
    };

    constructor.prototype = {
        resizeCanvas: function (channelId, width, height) {
            //if this.canvasContainer[channelId] is exist

            var canvas = this.canvasContainer[channelId];
            var size = new Size(width, height);

            var isPhone = false;
            if (document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1) {
                isPhone = true;
            }
            // maybe we need garbage collection.
            return (isPhone ? new RGB2dCanvas(canvas, size) : new YUVWebGLCanvas(canvas, size));
        },
        getCanvas: function (channelId) {
            return this.canvasContainer[channelId];
        }
    };

    return constructor;
})();


var KIND_HEADER_SIZE = 0;
var StreamPlayer = (function () {
    var capture;
    var isCapture;

    function constructor() {
        // initialize ffmpeg decoder
        this.jsFFmpeg_init = Module.cwrap('init_jsFFmpeg', 'void', []);
        this.jsFFmpeg_context = Module.cwrap('context_jsFFmpeg', 'number', []);
        this.jsFFmpeg_decode = Module.cwrap('decode_jsFFmpeg', 'void', ['number', 'array', 'number', 'number', 'number', 'number']);

        this.jsFFmpeg_init();
        this.context = this.jsFFmpeg_context();

        // buffer for canvas
        var oBuffer = new ArrayBuffer(this.outputBufferSize);
        this.outputBuffer = new Uint8Array(oBuffer);
        var iBuffer = new ArrayBuffer(this.iniputBufferSize);
        this.inputBuffer = new Uint8Array(iBuffer);
    };
    constructor.prototype = {
        readyStream: function (canvas) {
            this.webCanvas = canvas;

            // buffer for decoder
            this.outpicsize = this.webCanvas.size.w * this.webCanvas.size.h * 1.5;
            this.outpicptr = Module._malloc(this.outpicsize);
            this.outpic = new Uint8Array(Module.HEAPU8.buffer, this.outpicptr, this.outpicsize);
        },
        kindH264Decode: function (data) {
            // We'll remove KIND_HEADER_SIZE
            if ((data[0 + KIND_HEADER_SIZE] == 0 &&
                    data[1 + KIND_HEADER_SIZE] == 0 &&
                    data[2 + KIND_HEADER_SIZE] == 0 &&
                    data[3 + KIND_HEADER_SIZE] == 1) ||
                (data[0 + KIND_HEADER_SIZE] == 0 &&
                    data[1 + KIND_HEADER_SIZE] == 0 &&
                    data[2 + KIND_HEADER_SIZE] == 1)) {

                this.jsFFmpeg_decode(this.context, this.inputBuffer.subarray(0, this.inputBuffer.bufsize), this.inputBuffer.bufsize, this.outpic.byteOffset, this.webCanvas.size.w, this.webCanvas.size.h);

                // maybe we need garbage collection.
                this.outputBuffer = new Uint8Array(this.outpic.buffer, this.outpic.byteOffset, this.outpicsize);

                if (!this.outputBuffer) {
                    console.log("output buffer is null!");
                    return;
                }

                // draw picture in canvas.
                this.webCanvas.drawCanvas(this.outputBuffer);
                if (isCapture) {
                    capture = this.webCanvas.canvas.toDataURL();
                    isCapture = false;
                }

                this.inputBuffer.set(data.subarray(KIND_HEADER_SIZE, data.length), 0);
                this.inputBuffer.bufsize = data.length - KIND_HEADER_SIZE;

            } else {
                // when data is big, receiver reads sliced datas. this logic appends splited data to data which had come.
                this.inputBuffer.set(data.subarray(KIND_HEADER_SIZE, data.length), this.inputBuffer.bufsize);
                this.inputBuffer.bufsize += (data.length - KIND_HEADER_SIZE);

            }
        },
        play: function (data) {
            this.kindH264Decode(data);
        },
        getCapture: function (callback) {
            isCapture = true;
            var myInterval = setInterval(function () {
                if (isCapture === false) {
                    callback(capture);
                    clearInterval(myInterval);
                }
            }, 30);
        }

    };

    return constructor;
})();


//buffersize
StreamPlayer.prototype.outputBufferSize = 1024 * 1024 * 2;
StreamPlayer.prototype.iniputBufferSize = 600000;

var KindStreamManager = (function () {
    
    var connectionInfo = {
        server_address: '',
        port: 80
    };

    function constructor() {
        this.streamPlayerContainer = {};
        this.streamerContainer = {};
        this.profileInfoContainer = [];
        //we need singleton
        this.canvasManager = new CanvasManager();
    };
    constructor.prototype = {
        open: function (info) {
            connectionInfo.server_address = info.device.server_address;
            connectionInfo.port = info.device.port;

            var profileInfo = {
                device: {
                    cameraIp: '',
                    user: '',
                    password: ''
                },
                media: {
                    type: 'live',
                    requestInfo: {
                        cmd: 'open',
                        url: 'profile2',
                        scale: 1
                    }
                }
            };
            profileInfo.device.cameraIp = info.device.cameraIp;
            profileInfo.device.user = info.device.user;
            profileInfo.device.password = info.device.password;
            profileInfo.media.type = info.media.type;
            profileInfo.media.requestInfo.cmd = info.media.requestInfo.cmd;
            profileInfo.media.requestInfo.url = info.media.requestInfo.url;
            profileInfo.media.requestInfo.scale = info.media.requestInfo.scale;

            var channelId = info.device.channelId,
                width = info.media.size.width,
                height = info.media.size.height;
            // When Server Streamer is Exist
            if (this.streamerContainer.hasOwnProperty(channelId)) {
                this.close(channelId);
            }


            // we need additional information for resolution.
            // canvasManager creates canvas for rgb or webgl.
            // and we can get canvas which is selected by user.
            console.log(width, height);
            var canvas = this.canvasManager.resizeCanvas(channelId, width, height);

            // channel : kind_stream = 1 : 1
            var kind_stream_player;
            if (!this.streamPlayerContainer.hasOwnProperty(channelId)) {
                kind_stream_player = new StreamPlayer();
                this.streamPlayerContainer[channelId] = kind_stream_player;
            } else {
                kind_stream_player = this.streamPlayerContainer[channelId];
            }
            kind_stream_player.readyStream(canvas);


            var streamer = new Streamer();
            // set player in Streamer
            streamer.assignPlayer(kind_stream_player);
            this.streamerContainer[channelId] = streamer;

            console.log("Open ", channelId, "Channel!");
            profileInfo.media.requestInfo.cmd = 'open';
            streamer.openStream(profileInfo, connectionInfo);
            this.profileInfoContainer[channelId] = profileInfo;
        },
        close: function (channelId) {
            console.log("Close ", channelId, "Channel!");
            var streamer = this.streamerContainer[channelId];
            streamer.closeStream();
        },
        terminate: function (channelId) {
            var streamer = this.streamerContainer[channelId];
            var profileInfo = this.profileInfoContainer[channelId];
            profileInfo.media.requestInfo.cmd = 'close';
            streamer.controlStream(profileInfo);
            this.close(channelId);
            this.streamerContainer[channelId] = null;
        },
        resume: function (channelId) {
            var streamer = this.streamerContainer[channelId];
            var profileInfo = this.profileInfoContainer[channelId];
            profileInfo.media.requestInfo.cmd = 'resume';
            streamer.controlStream(profileInfo);
        },
        pause: function (channelId) {
            var streamer = this.streamerContainer[channelId];
            var profileInfo = this.profileInfoContainer[channelId];
            profileInfo.media.requestInfo.cmd = 'pause';
            streamer.controlStream(profileInfo);
        },
        forward: function (channelId, scale) {
            console.log(channelId);
            var streamer = this.streamerContainer[channelId];
            var profileInfo = this.profileInfoContainer[channelId];
            var type = profileInfo.media.type;
            if (type === 'live') {
                console.log("FF is invalid command in live");
                return;
            }
            profileInfo.media.requestInfo.cmd = 'scale';
            profileInfo.media.requestInfo.scale = scale;
            streamer.controlStream(profileInfo);
        },
        backward: function (channelId, scale) {
            var streamer = this.streamerContainer[channelId];
            var profileInfo = this.profileInfoContainer[channelId];
            var type = profileInfo.media.type;
            if (type === 'live') {
                console.log("FB is invalid command in live");
                return;
            }
            profileInfo.media.requestInfo.cmd = 'scale';
            profileInfo.media.requestInfo.scale = scale * -1;
            streamer.controlStream(profileInfo);
        },
        seek: function (channelId, time /* 20151003134022 or 5 */ ) {
            var streamer = this.streamerContainer[channelId];
            var profileInfo = this.profileInfoContainer[channelId];
            var type = profileInfo.media.type;
            var cmd = profileInfo.media.requestInfo.cmd;
            if (type === 'live') {
                console.log(cmd, "is invalid command in live");
                return;
            }
            profileInfo.media.requestInfo.cmd = 'seek';
            profileInfo.media.requestInfo.scale = time;
            streamer.controlStream(profileInfo);
        },
        capture: function (channelId) {
            var can = this.streamPlayerContainer[channelId];
            can.getCapture(function(data){
                var link = document.createElement('a');
                link.download = "capture.png"; // we need to change filename with timestamp
                link.href = data.replace("image/png", "image/octet-stream");
                link.click();    
            });
        }
    };

    return constructor;
})();