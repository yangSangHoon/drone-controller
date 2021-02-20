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

    this.isIE = false;
    this.eventSetting = function(){
        var _this = this;
        var hangle = this.handle || this;
       
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

    this.touchstart = function( event ){
        var offset = this.getOffset( event );

        this.pos.pageX = offset.pageX - $(this).position().left;
        this.pos.pageY = offset.pageY - $(this).position().top;
        
         if( this.clickCenter ){
            this.css( pos );
        }
        
        this.dragStart = true;
        if( this.start != null ) this.start( event, this,  this.pos, offset );
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

    this.getPos = function( touches ){
        if( touches == null ) return;
        for( var i = 0; i<touches.length; i++ ){
            if( touches[i].target == this[0] ){
                return touches[i];
            }
        }
    }

     this.getOffset = function( event ){
        var oe = event.originalEvent;
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

        var pos;
        if( this.radius != null ){
            pos = this.getCustumData( tarLeft, tarTop );
        }else{
            pos = { left: tarLeft, top: tarTop };
        }
        return pos
    }

    //핸들러 원모양의 이동한계점 및 중심점으로 부터의 거리 및 각도 리턴
    this.getCustumData = function( left, top ){

        var tarLeft = left; 
        var tarTop = top;

        var result;
        var distance = Math.sqrt( Math.pow( left - this.radius, 2 ) + Math.pow( top - this.radius, 2 ) );
        var radians = Math.atan2( top - this.radius, left - this.radius );

        if( distance <= this.radius ){
            result = { left : tarLeft, top : tarTop };
        }else{
            distance = this.radius;
            result = {
                left : Math.cos( radians ) * this.radius + this.radius,
                top : Math.sin( radians ) * this.radius + this.radius
            }
        }

        result.distance = distance;
        result.radians = radians;

        return result;
    }

    this.init();

    return this;
}



$.fn.kindIEDraggable = function(data){
        
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
    var pointer = [];
    this.eventSetting = function(){
        var _this = this;
        var hangle = this.handle || this;
        hangle[0].addEventListener('pointerdown', function (event) {
            _this.touchstart(event);
        });
        document.addEventListener('pointermove', function (event) {
            _this.touchmove(event);
        });
        document.addEventListener('pointerup', function (event) {
            _this.touchend(event);
        });
    }

    this.touchstart = function (event) {
        pointer.push({
            id : event.pointerId,
            event : event
        })
        var offset = this.getPointer( event );
        this.pos.pageX = offset.pageX - $(this).position().left;
        this.pos.pageY = offset.pageY - $(this).position().top;
        this.dragStart = true;
        if( this.start != null ) this.start(event, this);
    }
    this.touchmove = function( event ){
      
            var pointer = this.getPointer(event);
            if (pointer == null) return;
            var target = pointer.target;
            var pos = this.checkPos({ left: event.pageX - this.pos.pageX, top: event.pageY - this.pos.pageY });
            $(target).css( pos );
            if( this.drag != null ) this.drag(event, this);
       
    }
    this.touchend = function( event ){
        
      
            var pointer = this.getPointer(event);
            if (pointer == null) return;
            var target = $(pointer.target);
            if( this.revert == true ){
                target.animate({ left: this.startPos.pageX, top: this.startPos.pageY }, this.revertDuration);
            }else if( this.revert == 'x' ){
                target.animate({left: this.startPos.pageX }, this.revertDuration );
            }else if( this.revert == 'y' ){
                target.animate({left: this.startPos.pageY }, this.revertDuration );
            }
            if( this.stop != null ) this.stop(event, this);
            this.removePointer( event );
      
        
    }
    this.getPointer = function (event) {
        for (var i = 0; i < pointer.length; i++) {
            if( event.pointerId == pointer[i].id ){
                return pointer[i].event;
            }
        }
     }
    this.removePointer = function (event) {
        for (var i = 0; i < pointer.length; i++) {
            if( event.pointerId == pointer[i].id ){
                pointer.splice( i, 1 );
            }
        }
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

        var pos;
        if( this.radius != null ){
            pos = this.getCustumData( tarLeft, tarTop );
        }else{
            pos = { left: tarLeft, top: tarTop };
        }
        return pos
    }

    //핸들러 원모양의 이동한계점 및 중심점으로 부터의 거리 및 각도 리턴
    this.getCustumData = function( left, top ){

        var tarLeft = left; 
        var tarTop = top;

        var result;
        var distance = Math.sqrt( Math.pow( left - this.radius, 2 ) + Math.pow( top - this.radius, 2 ) );
        var radians = Math.atan2( top - this.radius, left - this.radius );

        if( distance <= this.radius ){
            result = { left : tarLeft, top : tarTop };
        }else{
            distance = this.radius;
            result = {
                left : Math.cos( radians ) * this.radius + this.radius,
                top : Math.sin( radians ) * this.radius + this.radius
            }
        }

        result.distance = distance;
        result.radians = radians;

        return result;
    }
    this.init();
    return this;
}