var RandomLatice = (function() {
	var RandomLatice = function RandomLatice(canvasId, probability, size, zoom) {
		this.canvas = document.getElementById(canvasId);
		if(this.canvas) {
			var canvasParent = this.canvas.parentElement;
			canvasParent.removeChild(this.canvas);

			this.canvas = document.createElement('canvas');
			this.canvas.id = canvasId;

			canvasParent.appendChild(this.canvas);
		}

		this.probability = probability;
		this.size = size;
		this.zoom = zoom;

		this.canvas.width = zoom * size;
		this.canvas.height = zoom * size;
	}

	RandomLatice.prototype.generateLatice = function() {
		var permutation = (new Array(this.size * this.size)).fill(0)
			.map((element, index) => index);

		function shuffle(array) {
			var tmp, current, top = array.length;

			if(top) while(--top) {
				current = Math.floor(Math.random() * (top + 1));
				tmp = array[current];
				array[current] = array[top];
				array[top] = tmp;
			}
			return array;
		}

		permutation = shuffle(permutation);

		for(var i = 0; i < permutation.length; i++) {
			if(i < Math.floor(this.probability * permutation.length)) {
				this.imageData.data[4 * permutation[i] + 0] = 0;
				this.imageData.data[4 * permutation[i] + 1] = 0;
				this.imageData.data[4 * permutation[i] + 2] = 0;
				this.imageData.data[4 * permutation[i] + 3] = 255;
			} else {
				this.imageData.data[4 * permutation[i] + 0] = 255;
				this.imageData.data[4 * permutation[i] + 1] = 255;
				this.imageData.data[4 * permutation[i] + 2] = 255;
				this.imageData.data[4 * permutation[i] + 3] = 255;
			}
		}
	}

	RandomLatice.prototype.create = function() {
		this.context = this.canvas.getContext('2d');
		this.imageData = this.context.createImageData(this.size, this.size);

		this.generateLatice();

		this.context.putImageData(this.imageData, 0, 0);
		this.context.imageSmoothingEnabled = false;
		this.context.drawImage(this.canvas, 0, 0);

		this.dataUrl = this.canvas.toDataURL('image/png');
	}

	return RandomLatice;
}());