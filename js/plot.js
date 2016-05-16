var Plot = (function() {
	var Plot = function(plotDOMElement, points, width, height) {
		if(plotDOMElement) {
			plotDOMElement.innerHTML = '';
			this.canvas = document.createElement('canvas');
			plotDOMElement.appendChild(this.canvas);
		}

		this.canvas.width = width;
		this.canvas.height = height;

		this.points = points || [];

		this.max = points.length && points.reduce((p, v) => p.y > v.y ? p : v);
	}

	Plot.prototype.draw = function(points) {debugger;
		if(points) {
			this.points = points;
			this.max = points.length && points.reduce((p, v) => p.y > v.y ? p : v).y;
		}
		var amount = this.points.length;
		var stepX = this.canvas.width / amount;
		var stepY = this.canvas.height / this.max;

		var context = this.canvas.getContext('2d');

		for(var i = 0; i < amount; i++) {
			context.beginPath();
			context.arc(
				Math.floor(this.points[i].x * stepX), 
				Math.floor(this.canvas.height + 
					(this.points[i].y / this.max === 1 ? 10 : 0) - this.points[i].y * stepY), 
				Math.ceil(5 * this.points[i].y / this.max),
				0, 2 * Math.PI, false
			);
			context.fillStyle = 'red';
			context.fill();
			context.lineWidth = 2;
			context.strokeStyle = '#ff0000';
			context.stroke();
		}
	};

	return Plot;
} ());