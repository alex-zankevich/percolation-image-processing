var Percolator = (function() {
	var Percolator = function() {
		this.imgUrl = null;
		this.errorValue = 20;
		this.canvas = null;
		this.context = null;
		this.img = null;
		this.pixelMatrix = null;
		this.blackValue = 100;

		this.clusters = [];
	}

	Percolator.prototype.init = function(canvas, imgUrl, options) {
		this.initialState = {
			canvas: canvas,
			imgUrl: imgUrl,
			options:options
		}

		this.canvas = canvas;
	    this.context = this.canvas.getContext('2d');

	    this.img = new Image();

		this.img.src = imgUrl;
	    this.img.crossOrigin = "anonymous";

	    this.img.onload = () => {
	    	if(options) {
	    		this.context.drawImage(
	    			this.img,
	    			0, 0,
	    			this.img.width, this.img.height,
	    			0, 0,
	    			options.zoom * this.img.width, options.zoom * this.img.height
	    		);
	    	} else {
	    		this.canvas.width = this.img.width;
	    		this.canvas.height = this.img.height;

	    		this.context.drawImage(this.img, 0, 0);
	    	}

			this.pixelMatrix = this.transformArrayToMatrix(
				this.context.getImageData(0, 0, this.img.width, this.img.height).data,
				this.img.width, this.img.height
			);

		};
	}

	Percolator.prototype.updateImageByData = function() {
		var data = this.context.getImageData(0, 0, this.img.width, this.img.height);

		this.copyArrayFromTo(
			this.transformMatrixToArray(this.pixelMatrix),
			data.data
		);

		this.context.putImageData(data, 0, 0);
	}

	Percolator.prototype.clickPercolationOn = function() {
		var onClickPercolation = event => {
			this.percolateFromPoint(event.layerX, event.layerY);
			this.updateImageByData();
		}

		this.canvas.removeEventListener('click', onClickPercolation);
		this.canvas.addEventListener('click', onClickPercolation);
	}

	Percolator.prototype.resetCanvas = function() {
		this.init(
			this.initialState.canvas,
			this.initialState.imgUrl,
			this.initialState.options
		);
	}

	Percolator.prototype.percolateFromPoint = function(x, y, colorSetting) {
		if(this.pixelMatrix[y][x].isPercolated) {
			return;
		}

		var clusterSize = 1;
		var color;


		var initialPoint = {
			r: this.pixelMatrix[y][x].r,
			g: this.pixelMatrix[y][x].g,
			b: this.pixelMatrix[y][x].b
		};

		if(colorSetting) {
			switch(colorSetting) {
				case 'black-white':
					if((initialPoint.r + initialPoint.g + initialPoint.b) / 3 < (this.blackValue ? this.blackValue : 100)) {
						color = [0, 0, 0, 255];
					} else {
						color = [255, 255, 255, 255];
					}
					break;
				default:
					color = new Array(4)
						.fill(4)
						.map(color => Math.floor(Math.random() * 255));
					break;
			}
		} else {
			color = new Array(4)
				.fill(4)
				.map(color => Math.floor(Math.random() * 255))
		}
		var border = [this.pixelMatrix[y][x]];

		this.pixelMatrix[y][x].isBorder = true;

		function checkMatrixCell(cell, color, errorValue) {
			if(cell && !cell.isBorder && !cell.isPercolated && cell.isEqual(initialPoint, errorValue)) {

				cell.isPercolated = true;
				cell.isBorder = true;

				border.push(cell);

				clusterSize++;
			}
		}

		function isCellBorder(neighbors) {
			for(let neighbor in neighbors) {
				if(neighbors[neighbor] && neighbors[neighbor].isBorder) return false;
			}

			return true;
		}

		while(border.length) {
			var current = border.shift();

			var neighbors = {
				top: this.pixelMatrix[current.y - 1] && this.pixelMatrix[current.y - 1][current.x + 0],
				left: this.pixelMatrix[current.y] && this.pixelMatrix[current.y][current.x - 1],
				right: this.pixelMatrix[current.y] && this.pixelMatrix[current.y][current.x + 1],
				bottom: this.pixelMatrix[current.y + 1] && this.pixelMatrix[current.y + 1][current.x + 0]
			}

			checkMatrixCell(current, color, this.errorValue);
			checkMatrixCell(neighbors.top, color, this.errorValue);
			checkMatrixCell(neighbors.left, color, this.errorValue);
			checkMatrixCell(neighbors.right, color, this.errorValue);
			checkMatrixCell(neighbors.bottom, color, this.errorValue);

			if(!isCellBorder(neighbors)) {
				current.isBorder = false;
			}

			current.isPercolated = true;
			current.setPixelColor(color);
		}

		return clusterSize;
	}

	Percolator.prototype.runClustersPercolation = function() {
		this.clusters = [];

		for(var i = 0; i < this.pixelMatrix.length; i++) {
			for(var j = 0; j < this.pixelMatrix[i].length; j++) {
				if(!this.pixelMatrix[i][j].isPercolated &&
					!this.pixelMatrix[i][j].getPixelColor().every(color => color === 255)) {
					this.clusters.push(this.percolateFromPoint(j, i));
				}
			}
		}

		return this.clusters;
	}

	Percolator.prototype.runImageBlackAndWhite = function() {
		this.clusters = [];

		for(var i = 0; i < this.pixelMatrix.length; i++) {
			for(var j = 0; j < this.pixelMatrix[i].length; j++) {
				if(!this.pixelMatrix[i][j].isPercolated) {
					this.clusters.push(this.percolateFromPoint(j, i, 'black-white'));
				}
			}
		}

		return this.clusters;
	}

	Percolator.prototype.transformArrayToMatrix = function(data, width, height) {
		var result = [];
		for(var i = 0; i < height; i++) {
			result.push([]);
			for(var j = 0; j < width; j++) {
				result[i].push(new Pixel(j, i, data.slice((i * width + j) * 4, 4 * (i * width + j + 1))));
			}
		}
		return result;
	}

	Percolator.prototype.transformMatrixToArray = function(matrix) {
		var result = [];
		for(var i = 0; i < matrix.length; i++) {
			for(var j = 0; j < matrix[i].length; j++) {
				var cell = matrix[i][j];

				result.push(cell.r);
				result.push(cell.g);
				result.push(cell.b);
				result.push(cell.a);
			}
		}
		return result;
	}

	Percolator.prototype.copyArrayFromTo = function(fromArray, toArray) {
		for(var i = 0; i < toArray.length; i++) {
			toArray[i] = fromArray[i];
		}
	}

	return Percolator;
})();
