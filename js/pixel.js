var Pixel = (function() {
	var Pixel = function(x, y, color) {
		this.setPixelColor = function(color) {
			[
				this.r,
				this.g,
				this.b,
				this.a
			] = color;
		}

		this.x = x;
		this.y = y;

		color ? this.setPixelColor(color) : this.setPixelColor([255, 255, 255, 255]);

		this.isBorder = false;
		this.isPercolated = false;
	}

	Pixel.prototype.isEqual = function(anotherPixel, errorValue) {
		if(
    		Math.abs(this.r - anotherPixel.r) < errorValue &&
    		Math.abs(this.g - anotherPixel.g) < errorValue &&
    		Math.abs(this.b - anotherPixel.b) < errorValue
    	) return true;

    	return false;
	}

	Pixel.prototype.getPixelColor = function() {
		return [this.r, this.g, this.b, this.a];
	}

	return Pixel;
})();