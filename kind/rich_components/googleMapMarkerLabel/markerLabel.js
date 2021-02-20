if( typeof google != 'undefined' ){
    google.maps.Marker.prototype.setLabel = function(label){
        this.label = new MarkerLabel({
          map: this.map,
          marker: this,
          text: label
        });
        this.label.bindTo('position', this, 'position');
    };

    var MarkerLabel = function(options) {
        this.options = options;
        this.setValues(options);
        this.span = document.createElement('span');
        this.span.className = 'map-marker-label';
    };

    MarkerLabel.prototype.options = null;
    MarkerLabel.prototype = $.extend(new google.maps.OverlayView(), {
        onAdd: function() {
            this.getPanes().overlayImage.appendChild(this.span);
            var self = this;
            this.listeners = [
            google.maps.event.addListener(this, 'position_changed', function() { self.draw();    })]
        },
        draw: function() {
            var text = String(this.get('text'));
            var position = this.getProjection().fromLatLngToDivPixel(this.get('position'));
            this.span.innerHTML = text;
            this.span.style.left = (position.x - this.span.offsetWidth/2) + 'px';
            this.span.style.top = ( position.y + this.options.marker.topGap ) + 'px';

        }
    });    
}

