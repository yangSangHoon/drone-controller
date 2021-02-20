
var kindStreamModule = angular.module('kindStreamModule', []);
kindStreamModule.factory('kindStreamInterface', function(){
    var channelContainer = [];
    var streamControlContainer = [];
    var manager;
    return{
        init:function(){
            manager = new KindStreamManager();  
            streamControlContainer['open'] = this.open;
            streamControlContainer['close'] = this.close;
            streamControlContainer['pause'] = this.pause;
            streamControlContainer['resume'] = this.resume;
            streamControlContainer['ff'] = this.ff;
            streamControlContainer['fb'] = this.fb;
            streamControlContainer['seek'] = this.seek;     
            
            streamControlContainer['capture'] = this.capture;      
        },
        changeStreamInfo: function(kindplayerdata){
            channelContainer[kindplayerdata.device.channelId] = kindplayerdata;
            console.log("Kind Stream Profile is changed !");
            var control =  streamControlContainer[kindplayerdata.media.requestInfo.cmd];
            control(kindplayerdata);
        },
        open: function(kindplayerdata){
            var channelId = kindplayerdata.device.channelId;
            var info = channelContainer[channelId];
            if(info !== undefined){
                manager.open(info);
                console.log(info.device.channelId + " ch is playing!");
            }
        },
        close: function(kindplayerdata){
            var channelId = kindplayerdata.device.channelId;
            var info = channelContainer[channelId];
            if(info !== undefined){
                manager.close(info.device.channelId);
                console.log(info.device.channelId + " ch is stoping!");
            }
        },
        resume:function(kindplayerdata){
            var channelId = kindplayerdata.device.channelId;
            if(manager){
                manager.resume(channelId);
            }
            else{
                console.log("Play(Resume) Error: Not Found Stream!");
            }
        },
        pause:function(kindplayerdata){
            var channelId = kindplayerdata.device.channelId;
            if(manager){
                manager.pause(channelId);
            }
            else{
                console.log("Pause Error: Not Found Stream!");
            }
        },
        ff:function(kindplayerdata){
            var channelId = kindplayerdata.device.channelId;
            var scale = kindplayerdata.media.requestInfo.scale;
            if(manager){
                manager.forward(channelId, scale);
            }
            else{
                console.log("FF Error: Not Found Stream!");
            }
        },
        fb:function(kindplayerdata){
            var channelId = kindplayerdata.device.channelId;
            var scale = kindplayerdata.media.requestInfo.scale;
            if(manager){
                manager.backward(channelId, scale);
            }
            else{
                console.log("FB Error: Not Found Stream!");
            }
        },
        seek:function(kindplayerdata){
            var channelId = kindplayerdata.device.channelId;
            var time = kindplayerdata.media.requestInfo.scale;
            if(manager){
                manager.seek(channelId, time);
                kindplayerdata.media.requestInfo.cmd = 'init';
            }
            else{
                console.log("Seek Error: Not Found Stream!");
            }
        },
        capture:function(kindplayerdata){
            manager.capture(kindplayerdata.device.channelId);
                kindplayerdata.media.requestInfo.cmd = 'init';
        },
        getInstance: function(){
            return manager;
        }
    }
});

kindStreamModule.factory('kindPlaybackInterface', function(kindStreamInterface){
    var ffScale=[];
    var fbScale=[];
    var callControl;
    return{
        playbackcontrols:{
            fb:function(channelId, scale){
                if(kindStreamInterface.getInstance()){
                    kindStreamInterface.getInstance().backward(channelId, scale);
                }
                else{
                    console.log("FB Error: Not Found Stream!");
                }
            },
            play:function(channelId){
                if(kindStreamInterface.getInstance()){
                    kindStreamInterface.getInstance().resume(channelId);
                }
                else{
                    console.log("Play(Resume) Error: Not Found Stream!");
                }
            },
            pause:function(channelId){
                if(kindStreamInterface.getInstance()){
                    kindStreamInterface.getInstance().pause(channelId);
                }
                else{
                    console.log("Pause Error: Not Found Stream!");
                }
            },
            ff:function(channelId, scale){
                if(kindStreamInterface.getInstance()){
                    kindStreamInterface.getInstance().forward(channelId, scale);
                }
                else{
                    console.log("FF Error: Not Found Stream!");
                }
            }
        },
        init:function(ind, ctrl){
            ffScale[ind] = 1;
            fbScale[ind] = 1;
            if(ctrl !== undefined)                
                callControl = ctrl;
        },
        control:function(kindPlayback, command, chId){
            if( command == 'ff' ) {
                ffScale[chId] *= 2;
                if(ffScale[chId] > 8) {
                    ffScale[chId] = 1;
                }
                kindPlayback[chId].scale = ffScale[chId];
                fbScale[chId] = 1;
            }
            else if( command == 'fb' ) {
                fbScale[chId] *= 2;
                if(fbScale[chId] > 8) {
                    fbScale[chId] = 1;
                }
                kindPlayback[chId].scale = fbScale[chId];
                ffScale[chId] = 1;
            }
            else{
                ffScale[chId] = 1;
                fbScale[chId] = 1;
                kindPlayback[chId].scale = 1;
            }
            console.log("ffScale:", ffScale[chId], "fbScale:", fbScale[chId]);
            kindPlayback[chId].control = command;
            
            callControl(kindPlayback[chId]);
        }
    }
});

kindStreamModule.directive('kindStream', function(kindStreamInterface){
    return{
        restrict:'E',
        scope:{
            kindplayer:'='
        },
//        templateUrl:'kind/common_modules/cm_h264_decoder/kind_stream.html',
        template:'<div>' +
                 '<canvas class="kind-stream-canvas"></canvas>'+
                 '</div>',
        controller:["$scope", function($scope){
             kindStreamInterface.init(0);
        }],
        link:function(scope, elem, attrs){    
            scope.$watch('kindplayer', function(kindplayerdata){
                if( kindplayerdata === undefined)
                    return;
                if(kindplayerdata.media.requestInfo.cmd == 'init' || 
                   kindplayerdata.media.requestInfo.cmd === undefined 
                  ){
//                    console.log(kindplayerdata.media.requestInfo.cmd);
                    return;
                }
                var chId = kindplayerdata.device.channelId;
                var pbData = {
                    on:'off', 
                    channelId:chId, 
                    control:'init',
                    scale:1
                };
                if(kindplayerdata.media.type === 'live'){
                    scope.$emit('playback_directive_switch['+chId+']', pbData);
                    console.log('live');
                }
                else{
                    pbData.on = 'on';
                    scope.$emit('playback_directive_switch['+chId+']', pbData);
                    console.log('playback');
                }
                kindStreamInterface.changeStreamInfo(kindplayerdata);
            }, true);
        }
    };
});

kindStreamModule.directive('kindPlayback', function($compile, kindPlaybackInterface){
    return{
        restrict:'EA',
        link:function(scope,element,attrs){
            
            var callControl = function(data){
                console.log(data);
                scope.$emit('kindPlaybackControl['+data.channelId+']', data);
            }
                        
            if(scope.kindPlayback === undefined){
                scope.kindPlayback = [];
            }
            var pb = scope.$eval(attrs.kindPlayback);
            scope.kindPlayback[pb.channelId] = pb;
            scope.$on('kindPlaybackControl['+pb.channelId+']', function(event, args) {
                var command = args;
                kindPlaybackInterface.playbackcontrols[command.control](command.channelId, command.scale);
            });
            
            scope.$on('playback_directive_switch['+pb.channelId+']',function(event, args){
                var temp = {
                    on:args.on,
                    channelId:args.channelId,
                    control:args.control
                };
                var chId = args.channelId;
                scope.kindPlayback[chId] = temp;
                kindPlaybackInterface.init(chId, callControl);
                if(scope.kindPlayback[chId].on == 'on' ){
                    scope.playbackcontrols = Object.keys(kindPlaybackInterface.playbackcontrols);
                    scope.control = kindPlaybackInterface.control;
                    scope.channelId = chId;
                    var li =    '<ul class="playback_ul">'+
                                    '<li ng-repeat="command in playbackcontrols" data-type="{{command}}">'+
                                        '<img src="images/{{command}}.png" ng-click="control(kindPlayback, command,'+chId+')" >'+
                                    '</li>'+
                                '</ul>';
                    var divWrap = $compile(li)(scope);
                    element.prepend(divWrap);
                    element.addClass('playback-wrap');
                    
                    console.log('add playback control panel!');
                }
                else{
                    $('ul.playback_ul',element).remove();
                    console.log('remove playback control panel!');
                }

            });
        }
    };
});