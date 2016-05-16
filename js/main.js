(function(){
	var plot = new Plot(
			document.querySelector('.plot'),
			[],
			600, 400
		);

	var runImagePercolation = function(event) {
		var error = +document.querySelector('#errorInput').value;
		var percolatorForImage = new Percolator();

		var canvasId = 'myCanvas';
		var canvas = document.getElementById(canvasId);
		if(canvas) {
			var canvasParent = canvas.parentElement;
			canvasParent.removeChild(canvas);

			canvas = document.createElement('canvas');
			canvas.id = canvasId;

			canvasParent.appendChild(canvas);
		}

		percolatorForImage.init(canvas, '../img/sample_mathematica.png');
		percolatorForImage.errorValue = error;
		percolatorForImage.clickPercolationOn();

		document.querySelector('#blackAndWhite').addEventListener('click', function() {
			var blackValue = +document.querySelector('#blackInput').value;
			percolatorForImage.blackValue = blackValue;

			percolatorForImage.runImageBlackAndWhite();
			percolatorForImage.updateImageByData();
		});
	}

	var runLaticePercolation = function(event) {
		var probability = +document.querySelector('#probabilityInput').value;
		var size = +document.querySelector('#sizeInput').value;
		var latice = new RandomLatice('myCanvasSecond', probability, size, 5);
		var percolatorForLatice = new Percolator();
		
		latice.create();
		percolatorForLatice.canvas = null;

		percolatorForLatice.init(latice.canvas, latice.dataUrl, {
			zoom: latice.zoom
		});

		function onClusters() {
			percolatorForLatice.runClustersPercolation();
			percolatorForLatice.updateImageByData();
		}

		function onCountClusters() {
			var points = [];

			var promise = new Promise(function(resolve, reject) {
				var step = 1;
				for(var i = 0; i < 100; i += step) {
					var probability = i / 100;
					var size = +document.querySelector('#sizeInput').value;
					var latice = new RandomLatice('myCanvasSecond', probability, size, 5);
					var percolatorForLatice = new Percolator();
					
					latice.create();
					percolatorForLatice.canvas = null;

					percolatorForLatice.init(latice.canvas, latice.dataUrl, {
						zoom: latice.zoom
					});

					(function(percolatorForLatice, i, points) {
						setTimeout(function() {
							points.push({
								x: i,
								y: percolatorForLatice.runClustersPercolation().length
							});

							if(i === (100 - step)) {
								resolve(points);
							}
						}, 1000);
					}(percolatorForLatice, i, points, step));
				}
			});

			promise.then(points => plot.draw(points))
		}

		document.querySelector('#reset')
			.addEventListener('click', percolatorForLatice.resetCanvas.bind(percolatorForLatice));

		document.querySelector('#clusters').addEventListener('click', onClusters);
		document.querySelector('#clusterCounter').addEventListener('click', onCountClusters);

		percolatorForLatice.clickPercolationOn();
	}

	runImagePercolation();
	runLaticePercolation();

	document.querySelector('#load').addEventListener('click', runImagePercolation);

	document.querySelector('#run').addEventListener('click', runLaticePercolation);
}());