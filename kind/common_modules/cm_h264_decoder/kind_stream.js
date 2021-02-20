var CanvasManager = (function () {

    function constructor(canvasSetting) {
        this.canvasContainer = {};

        var div = document.getElementById(canvasSetting.screenName);

        if (canvasSetting.channelCount == 0) {
            var canvas_list = document.querySelectorAll("." + canvasSetting.screenName);

            for (var i = 0; i < canvas_list.length; i++) {
                //TODO : responsive size
//                canvas_list[i].style.height = "100%";
                canvas_list[i].style.width = "100%";
                this.canvasContainer[i] = canvas_list[i];
            }

        } else {
            for (var i = 0; i < canvasSetting.channelCount; i++) {
                var canvas;
                canvas = document.createElement('canvas');
                div.appendChild(canvas);
                // We need how to apply css. below sentence is temporary.
                //canvas.style.width = "100%";
                canvas.style.height = "100%";
                canvas.className = 'ptz-button ';
                this.canvasContainer[i] = canvas;
            }
        }
    };

    constructor.prototype = {
        resizeCanvas: function (channelId, width, height) {
            //if this.canvasContainer[channelId] is exist
            //if channelId < KIND_CHANNEL_COUNT

            var newCanvas = document.createElement("canvas");
            newCanvas.className = 'stream-canvas';
            var targetCanvas = this.canvasContainer[channelId];
            targetCanvas.parentNode.replaceChild(newCanvas,targetCanvas);
            this.canvasContainer[channelId] = newCanvas;

            var canvas = this.canvasContainer[channelId];
            var size = new Size(width, height);

            var isPhone = false;
            if (document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1) {
                isPhone = true;
            }
            // maybe we need garbage collection.
            return (isPhone ? new RGB2dCanvas(canvas, size) : new YUVWebGLCanvas(canvas, size));
        }
    };

    return constructor;
})();

var KIND_HEADER_SIZE = 0;
var StreamPlayer = (function () {

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
        }

    };

    return constructor;
})();

//buffersize
StreamPlayer.prototype.outputBufferSize = 1024 * 1024 * 2;
StreamPlayer.prototype.iniputBufferSize = 600000;

function AjaxEx(channelId, rtspUrl, playType, callback) {
    $.ajax({
        url: "http://" + STREAM_SERVER_ADDRESS + "/stream/" + playType,
        type: "post",
        data: {
            "rtspUrl": rtspUrl,
            "channelId": channelId
        }, //url,
        dataType: "json",
        success: callback,
        error: function (request) {
            console.log("Failed : KindStreamManager can not get the url of streamer!");
        }
    });
}

var KindStreamManager = (function () {
    function constructor(canvasSetting) {
        this.streamPlayerContainer = {};
        this.streamReceiverContainer = {};
        //we need singleton
        this.canvasManager = new CanvasManager(canvasSetting);
    };
    constructor.prototype = {
        play: function (channelId, rtspUrl, width, height) {
            // When Streamer is Exist
            if (this.streamReceiverContainer.hasOwnProperty(channelId)) {
                this.stop(channelId);
            }


            // we need additional information for resolution.
            // canvasManager creates canvas for rgb or webgl.
            // and we can get canvas which is selected by user.
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


            var streamReceiver = new StreamReceiver();
            // set player in StreamReceiver
            streamReceiver.assignPlayer(kind_stream_player);
            this.streamReceiverContainer[channelId] = streamReceiver;

            
            // we have to send rtspUrl to StreamServer.
            // When StreamServer is received url, StreamServer creates streamer and assigns port number.
            // then we can get the websocket address and port number of streamer
            AjaxEx(channelId, rtspUrl, 'play', this.connectStream.bind(this));

        },
        connectStream: function (data) { //ws_streamer_address, player){            
            var streamReceiver = this.streamReceiverContainer[data.channelId];
            // connect websocket of streamer.
            streamReceiver.playStream("ws://" + data.ip + ":" + data.port + "/");

        },
        callbackSuccess: function (data) {

        },
        stop: function (channelId) {
            
            console.log("Stopping ", channelId, "Channel!");
            this.disconnectStream(channelId);
        },
        disconnectStream: function (channelId) {
            var receiver = this.streamReceiverContainer[channelId];
            receiver.stopStream();
        },
        terminate: function(channelId, rtspUrl){
            AjaxEx(channelId, rtspUrl, 'stop', this.connectStream.bind(this));
            this.stop(channelId);
        }
    };

    return constructor;
})();