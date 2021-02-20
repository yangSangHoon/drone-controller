(function (window) {
    "use strict";
    // jsmpeg by Dominic Szablewski - phoboslab.org, github.com/phoboslab
    //
    // Consider this to be under MIT license. It's largely based an an Open Source
    // Decoder for Java under GPL, while I looked at another Decoder from Nokia 
    // (under no particular license?) for certain aspects.
    // I'm not sure if this work is "derivative" enough to have a different license
    // but then again, who still cares about MPEG1?
    //
    // Based on "Java MPEG-1 Video Decoder and Player" by Korandi Zoltan:
    // http://sourceforge.net/projects/javampeg1video/
    //
    // Inspired by "MPEG Decoder in Java ME" by Nokia:
    // http://www.developer.nokia.com/Community/Wiki/MPEG_decoder_in_Java_ME
    
    var StreamReceiver = window.StreamReceiver = function () {
        this.assignPlayer = function(streamPlayer) {
            this.player = streamPlayer;
        }.bind(this);
        
        this.playStream = function(address) {
            var streamer = new WebSocket(address);
            if ( streamer instanceof WebSocket) {
                this.client = streamer;
                this.client.onopen = this.initSocketClient.bind(this);
            } else {
                console.log("Error WebSocket for Streamer!");
            }
        }.bind(this);
        
        this.stopStream = function() {
            if(this.client){
                this.client.close();
            }
            else{
                console.log("Invalid Websocket for Streamer!");
            }
        }.bind(this);
    };


    // ----------------------------------------------------------------------------
    // Streaming over WebSockets

    StreamReceiver.prototype.socketBufferSize = 512 * 1024; // 512kb each

    StreamReceiver.prototype.initSocketClient = function (client) {
        this.buffer = new Uint8Array(new ArrayBuffer(this.socketBufferSize));

        this.client.binaryType = 'arraybuffer';
        this.client.onmessage = this.receiveSocketMessage.bind(this);
    };

    StreamReceiver.prototype.receiveSocketMessage = function (event) {
        var messageData = new Uint8Array(event.data);
        if(this.player){
            this.player.play(messageData);
        }
        else{
            console.log("callback decoder is not assigned!");
        }
    };
})(window);
