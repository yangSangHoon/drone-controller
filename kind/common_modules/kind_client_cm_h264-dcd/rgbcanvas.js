/**
 *
 */

var RGB2dCanvas = (function () {
    function constructor(canvas, size) {
        this.canvas = canvas;
        this.canvas.width = size.w;
        this.canvas.height = size.h;
        this.size = size;
        this.web2dContext = canvas.getContext("2d");
        this.TempBufferFor2d = this.web2dContext.createImageData(canvas.width, canvas.height);
    }

    constructor.prototype = {
        drawCanvas: function (bufferData) {
            var width = this.canvas.width;
            var height = this.canvas.height;
            var yOffset = 0;
            var uOffset = width * height;
            var vOffset = width * height + (width * height) / 4;
            for (var h = 0; h < height; h++) {
                for (var w = 0; w < width; w++) {
                    var ypos = w + h * width + yOffset;

                    var upos = (w >> 1) + (h >> 1) * width / 2 + uOffset;
                    var vpos = (w >> 1) + (h >> 1) * width / 2 + vOffset;

                    var Y = bufferData[ypos];
                    var U = bufferData[upos] - 128;
                    var V = bufferData[vpos] - 128;

                    var R = (Y + 1.371 * V);
                    var G = (Y - 0.698 * V - 0.336 * U);
                    var B = (Y + 1.732 * U);

                    var outputData_pos = w * 4 + width * h * 4;
                    this.TempBufferFor2d.data[0 + outputData_pos] = R;
                    this.TempBufferFor2d.data[1 + outputData_pos] = G;
                    this.TempBufferFor2d.data[2 + outputData_pos] = B;
                    this.TempBufferFor2d.data[3 + outputData_pos] = 255;
                }
            }
            this.web2dContext.putImageData(this.TempBufferFor2d, 0, 0);
        },
        toString: function () {
            return "2dCanvas Size: " + this.size;
        }
    };
    return constructor;
})();