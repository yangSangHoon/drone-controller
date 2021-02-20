$.fn.kindDraggable = function(data){
        
    this.pos = {};
    this.startPos = {};
    this.start = null;
    this.drag = null;
    this.stop = null;
    this.revert = false;
    this.revertDuration = 100;
    this.dragStart = false;
    this.handle = null;
    this.area = {};

    $.extend( this, data );

    this.init = function(){

        this.startPos = {
            pageX : $(this).position().left,
            pageY : $(this).position().top
        };

        this.eventSetting();
    }

    this.pointer = [];
    this.isIE = false;
    this.eventSetting = function(){
        var _this = this;
        var hangle = this.handle || this;

        if(navigator.userAgent.match(/Windows Phone/i) || navigator.userAgent.match(/iemobile/i) ){
            this.isIE = true;
            hangle[0].addEventListener('pointerdown', function( event ){
                _this.touchstart( event );
            });

            hangle[0].addEventListener('pointermove', function( event ){
                _this.touchmove( event );
            });

            hangle[0].addEventListener('pointerup', function( event ){
                _this.touchend( event );
            });

        }else{
            hangle.bind('touchstart', function(event) {
                if( navigator.userAgent.match(/Android/i) ) {   // if you already work on Android system, you can        skip this step
                    event.preventDefault(); 
                }
                _this.touchstart( event );
            });
            hangle.bind('touchmove', function(event) {
                _this.touchmove( event );
            });
            
            hangle.bind('touchend', function(event) {
                _this.touchend( event );
            });
            
            hangle.bind('mousedown', function(event) {
                _this.touchstart( event );
            });
            $(document).bind('mousemove', function(event) {
                _this.touchmove( event );
            });
            
            $(document).bind('mouseup', function(event) {
                _this.touchend( event );
            });    
        }
    }


    this.touchstart = function( event ){
        this.pointer.push({
            id : event.pointerId,
            event : event
        })
        var offset = this.getOffset( event );
        this.pos.pageX = offset.pageX - $(this).position().left;
        this.pos.pageY = offset.pageY - $(this).position().top;
        this.dragStart = true;
        if( this.start != null ) this.start(event, this);
    }

    this.touchmove = function( event ){
        
        if( this.dragStart ){
            var offset = this.getOffset( event );
            var pos = this.checkPos( { left: offset.pageX - this.pos.pageX, top : offset.pageY - this.pos.pageY });
            this.css( pos );
            if( this.drag != null ) this.drag(event, this);
        };
    }

    this.touchend = function( event ){
        this.removePointer( event );

        if(  this.dragStart  ){
            this.dragStart = false;
            if( this.revert == true ){
                 this.animate({left: this.startPos.pageX, top :this.startPos.pageY }, this.revertDuration );
            }else if( this.revert == 'x' ){
                this.animate({left: this.startPos.pageX }, this.revertDuration );
            }else if( this.revert == 'y' ){
                this.animate({left: this.startPos.pageY }, this.revertDuration );
            }
            if( this.stop != null ) this.stop(event, this);    
        }
    }

    this.getPointer = function( event ){
        for( var i = 0; i < this.pointer.length; i++ ){
            if( event.pointerId == this.pointer[i].id ){
                return this.pointer[i].event;
            }
        }
     }

     this.removePointer = function( event ){
        for( var i = 0; i < this.pointer.length; i++ ){
            if( event.pointerId == this.pointer[i].id ){
                this.pointer.splice( i, 1 );
            }
        }
     }

    this.getPos = function( touches ){
        if( touches == null ) return;
        for( var i = 0; i<touches.length; i++ ){
            if( touches[i].target == this[0] ){
                return touches[i];
            }
        }
    }

     this.getOffset = function( event ){
        var oe;
        if( event.originalEvent == null ){  //ie인 경우
            return this.getPointer( event );
        }else{
            oe = event.originalEvent;
        }
        var offset;
        if( oe.changedTouches == null ){
            offset = event;
        }else{
            offset = this.getPos(oe.changedTouches);
        }
        return offset;
    }

    this.checkPos = function( pos ){
        var tarLeft = pos.left;
        var tarTop = pos.top;
        if (this.area.minX != null && tarLeft < this.area.minX) {
            tarLeft = this.area.minX;
        } else if (this.area.maxX != null && tarLeft > this.area.maxX) {
            tarLeft = this.area.maxX;
        }
        if (this.area.minY != null && tarTop < this.area.minY) {
            tarTop = this.area.minY;
        } else if (this.area.maxY != null && tarTop > this.area.maxY) {
            tarTop = this.area.maxY;
        }
        return { left: tarLeft, top: tarTop }
    }

    this.init();

    return this;
}