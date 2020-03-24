'use strict';

window.addEventListener('load', ()=> {
	// Get Canvases
	const figure = document.querySelector('#Figure');
	const graph = document.querySelector('#Graph');


	// Get Canvas Drawing Contexts
	const ctxF = figure.getContext('2d');
	const ctxG = graph.getContext('2d');

	const pointX = 3;
	let pointY = 2;
	let point1Dist = Math.sqrt(25 + Math.pow(pointY, 2));
	let point2Dist = Math.sqrt(9 + Math.pow(pointY, 2));
	let figureClicked = false;
	let graphPoints = {};
	let val1PosLabel = false;
	let val1NegLabel = false;
	let val2Label = false;

	// Setup Canvases
	function init() {
		// Set Canvas Sizes
		figure.width = window.innerWidth / 2 - 1;
		figure.height = window.innerHeight;

		graph.width = window.innerWidth / 2 - 1;
		graph.height = window.innerHeight;
	}
	

	// Helper Methods to Convert Percentage Values to Canvas Coordinates
	const cX = percentage => {
		return (window.innerWidth / 2 - 1) * percentage;
	};

	const cY = percentage => {
		return window.innerHeight * percentage;
	};

	const gX = xCoord => {
		return cX(0.5) + cX(0.05) * xCoord;
	};

	const gY = yCoord => {
		return cY(0.5) - cX(0.05) * yCoord;
	};

	function labelledText(ctx, text, xLeft, yTop, font = 20) {
		ctx.textAlign = 'start';
		ctx.textBaseline = 'top';
		ctx.font = font + 'px Inter';
		const textYOffset = 15;
		const labelPadding = 5;

		const pointText = ctx.measureText(text);
		ctx.fillStyle = '#2a2a2a';
		ctx.fillRect(
			xLeft - labelPadding,
			yTop + textYOffset - labelPadding,
			pointText.width + 2*labelPadding,
			pointText.actualBoundingBoxDescent + 2*labelPadding);
		ctx.fillStyle = '#eee';
		ctx.fillText(text, xLeft, yTop + textYOffset);
	}

	function draw() {
		// Reset Canvas
		ctxF.clearRect(0, 0, cX(1), cY(1));

		ctxF.lineWidth = 6;
		ctxF.strokeStyle = '#8a8a8a';
		
		ctxF.beginPath();
		ctxF.moveTo(cX(0.5), cY(0));
		ctxF.lineTo(cX(0.5), cY(1));
		ctxF.moveTo(cX(0), cY(0.5));
		ctxF.lineTo(cX(1), cY(0.5));
		ctxF.stroke();

		// Draw X Line
		ctxF.lineWidth = 3;
		ctxF.strokeStyle = '#c74e4e';
		ctxF.beginPath();
		ctxF.moveTo(gX(3), cY(0));
		ctxF.lineTo(gX(3), cY(1));
		ctxF.stroke();


		// Connections
		ctxF.strokeStyle = '#31eb9e';
		ctxF.lineWidth = 4;
		ctxF.beginPath();
		ctxF.moveTo(gX(-2), gY(0));
		ctxF.lineTo(gX(pointX), gY(pointY));
		ctxF.moveTo(gX(6), gY(0));
		ctxF.lineTo(gX(pointX), gY(pointY));
		ctxF.stroke();

		// Draw Points
		ctxF.fillStyle = '#c7bf4e';
		const pointRadius = 9;

		ctxF.beginPath();
		ctxF.ellipse(gX(-2), gY(0), pointRadius, pointRadius, 0, 0, Math.PI * 2);
		ctxF.ellipse(gX(6), gY(0), pointRadius, pointRadius, 0, 0, Math.PI * 2);
		ctxF.fill();

		// Y Point
		ctxF.fillStyle = '#002575';
		ctxF.beginPath();
		ctxF.ellipse(gX(pointX), gY(pointY), pointRadius, pointRadius, 0, 0, Math.PI * 2);
		ctxF.fill();

		// Labels
		labelledText(ctxF, '(-2, 0)', gX(-2), gY(0));
		labelledText(ctxF, '(6, 0)', gX(6), gY(0));
		labelledText(ctxF, 'x = 3', gX(4), gY(-4));
		labelledText(ctxF, point1Dist.toFixed(3), gX(0.5), gY(pointY / 2));
		labelledText(ctxF, point2Dist.toFixed(3), gX(4.5), gY(pointY / 2));
		labelledText(ctxF, '(' + pointX + ', ' + pointY.toFixed(3) + ')', gX(pointX), gY(pointY));

		// Clear Canvas
		ctxG.clearRect(0, 0, cX(1), cY(1));
		ctxG.strokeStyle = '#8a8a8a';
		ctxG.lineWidth = 6;
		
		ctxG.beginPath();
		ctxG.moveTo(cX(0.5), cY(0));
		ctxG.lineTo(cX(0.5), cY(1));
		ctxG.moveTo(cX(0), cY(0.5));
		ctxG.lineTo(cX(1), cY(0.5));
		ctxG.stroke();

		val1PosLabel = false;
		val1NegLabel = false;
		val2Label = false;

		labelledText(ctxG, 'x axis: Y Value of Point', gX(1), gY(0), 15);
		labelledText(ctxG, 'y axis: Difference between Distances', gX(0) + 15, gY(-5), 15);

		Object.keys(graphPoints).forEach(key => {
			let dotRadius = 4;
			const point = graphPoints[key];
			ctxG.fillStyle = '#002575';
			if (Math.abs(point[1] - 2) <= 0.001) {
				if (!val2Label) {
					labelledText(ctxG, '(' + point[0].toFixed(2) + ', ' + point[1].toFixed(2) + ')', gX(point[0]), gY(point[1]), 15);
				}
				val2Label = true;
				dotRadius = 8;
				ctxG.fillStyle = '#3266bf';
			} else if (Math.abs(point[1] - 1) <= 0.01) {
				if (!val1PosLabel && point[0] > 0) {
					labelledText(ctxG, '(' + point[0].toFixed(2) + ', ' + point[1].toFixed(2) + ')', gX(point[0]), gY(point[1]), 15);
					val1PosLabel = true;
				} else if (!val1NegLabel && point[0] < 0) {
					labelledText(ctxG, '(' + point[0].toFixed(2) + ', ' + point[1].toFixed(2) + ')', gX(point[0]), gY(point[1]), 15);
					val1NegLabel = true;
				}
				dotRadius = 8;
				ctxG.fillStyle = '#bf3282';
			}
			ctxG.beginPath();
			ctxG.ellipse(gX(key), gY(point[1]), dotRadius, dotRadius, 0, 0, Math.PI * 2);
			ctxG.fill();
		});

		labelledText(ctxG, '(' + pointY.toFixed(2) + ', ' + (point1Dist - point2Dist).toFixed(2) + ')', gX(pointY), gY(point1Dist - point2Dist), 15);
		ctxG.fillStyle = '#ded012';
		ctxG.beginPath();
		ctxG.ellipse(gX(pointY), gY(point1Dist - point2Dist), 10, 10, 0, 0, Math.PI * 2);
		ctxG.fill();
	}

	figure.addEventListener('mousedown', () => {
		figureClicked = true;
	});

	window.addEventListener('mouseup', () => {
		figureClicked = false;
	});

	figure.addEventListener('touchstart', () => {
		figureClicked = true;
	});

	window.addEventListener('touchend', () => {
		figureClicked = false;
	});

	figure.addEventListener('mousemove', event => {
		if (figureClicked) {
			const bounds = figure.getBoundingClientRect();
			const mouseY = event.clientY - bounds.top;
			const yCoord = (gY(0) - mouseY) / cX(0.05);
			pointY = yCoord;
			point1Dist = Math.sqrt(25 + Math.pow(pointY, 2));
			point2Dist = Math.sqrt(9 + Math.pow(pointY, 2));

			graphPoints[pointY.toPrecision(2)] = [pointY, point1Dist - point2Dist];

			draw();
		}
	});

	figure.addEventListener('touchmove', event => {
		if (figureClicked) {
			const bounds = figure.getBoundingClientRect();
			const mouseY = event.changedTouches[0].clientY - bounds.top;
			const yCoord = (gY(0) - mouseY) / cX(0.05);
			pointY = yCoord;
			point1Dist = Math.sqrt(25 + Math.pow(pointY, 2));
			point2Dist = Math.sqrt(9 + Math.pow(pointY, 2));

			graphPoints[pointY.toPrecision(2)] = [pointY, point1Dist - point2Dist];

			draw();
		}
	});

	document.querySelector('.ResetButton').addEventListener('click', () => {
		graphPoints = {};
		draw();
	});

	document.querySelector('.ModalClose').addEventListener('click', () => {
		document.querySelector('.Modal').classList.add('is-inactive');
		draw();
	});

	document.querySelector('.Modal').addEventListener('click', () => {
		document.querySelector('.Modal').classList.add('is-inactive');
		draw();
	});

	document.querySelector('.Help').addEventListener('click', () => {
		document.querySelector('.Modal').classList.remove('is-inactive');
	});

	init();
	draw();

	window.addEventListener('resize', () => {
		// Reconfigure Canvases
		init();

		// Rerender
		draw();
	});
	
});