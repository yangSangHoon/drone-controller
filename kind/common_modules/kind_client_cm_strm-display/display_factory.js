var KindDisplay = angular.module('KindDisplayModule',[]);
KindDisplay
    .factory('displayService', function(){
        return function(){

            var previous;
            
            var width,height,style,time;

            var divisionSize = function(targetWidth,targetHeight,stageWidth,stageHeight){
                var stageSum  = stageHeight + stageWidth;
                var sw = stageWidth*100/stageSum;
                var sh = stageHeight*100/stageSum;

                var targetSum  = targetHeight + targetWidth;
                var cw = targetWidth*100/targetSum;
                var ch = targetHeight*100/targetSum;

                var newWidth = sw - cw;
                var newHeight = sh - ch;
                
                return newWidth < newHeight;
            };

            var fullSize = function(element,stage){
                
                var canvas  = $('canvas',element);
                style = canvas.attr('style');
                
                var size = {
                    tw:canvas.width(),
                    th:canvas.height(),
                    sw:stage.width(),
                    sh:stage.height()
                }

                    
                element.addClass('full-screen');
                element.removeClass('origin-screen');
                element.removeClass('fit-screen');
                
                time = new Date().getTime();
                element.after("<span data-full-screen='"+previous+"'></span>");
                stage.prepend(element);

                if(divisionSize(size.tw,size.th,size.sw,size.sh)){
                    canvas.css({width:"100%",height:"auto"});
                }else{
                    canvas.css({height:"100%",width:"auto"});
                }


                element.dblclick(function(){
                    closeFullScreen();
                });
                
            };

            var closeFullScreen = function(){
                var span = $("span[data-full-screen]");
                var element = $("kind_stream.full-screen").length != 0 ? $("kind_stream.full-screen") : $("kind-stream.full-screen");
                if(span.length != 0){
                    span.after(element).remove();
                    element.removeClass('full-screen');
                    var previous = span.attr('data-full-screen');
                    switch(previous){
                        case'fit-screen':
                            fitSize(element);
                        break;
                        case'origin-screen':
                            originSize(element);
                        break;
                    }
                }
            };
            
            
            var originSize = function(element){
                previous = 'origin-screen';
                element.addClass('origin-screen');
                element.removeClass('fit-screen');
                
                var canvas  = $('canvas',element);

                width = canvas.attr('width');   
                height = canvas.attr('height');   
                style = canvas.attr('style');
                canvas.css({width:width+'px',height:height+'px'});
            };

            var fitSize = function(element){
                previous = 'fit-screen';
                var stage = element.find('div');
                var canvas  = $('canvas',element);

                var size = {
                    tw:canvas.width(),
                    th:canvas.height(),
                    sw:stage.width(),
                    sh:stage.height()
                }
                
                element.addClass('fit-screen');
                element.removeClass('origin-screen');
                if(divisionSize(size.tw,size.th,size.sw,size.sh)){
                    canvas.css({width:"100%",height:"auto"});
                }else{
                    canvas.css({height:"100%",width:"auto"});
                }
            };


            return {
                previous:previous,
                fullSize:fullSize,
                closeFullScreen:closeFullScreen,
                originSize:originSize,
                fitSize:fitSize
            }
    
        }
    });

