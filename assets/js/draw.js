var PENCIL = 0;
var THICKBRUSH = 1;
var VARIABLEBRUSH = 2;

var path;
var currentStyle = PENCIL;
var stroke = 1;
var color = "black"
var lastPoint;
var strokeEnds = 6;

// tool.fixedDistance = 30;

function onMouseDown(event) {
	path = new Path();

	if (currentStyle == PENCIL) {
		path.strokeColor = color;
		path.strokeWidth = stroke;
	}

	if (currentStyle == THICKBRUSH) {
		path.fillColor = color;
	}
}

function onMouseDrag(event) {

	if (currentStyle == PENCIL) {
		path.add(event.point);
	}

	if (currentStyle == THICKBRUSH) {
		if (event.count == 1) {
			addStrokes(event.middlePoint, event.delta * -1);
		} else {
			var step = event.delta / 2;
			step.angle += 90;

			var top = event.middlePoint + step;
			var bottom = event.middlePoint - step;

			path.add(top);
			path.insert(0, bottom);
		}
		

		path.smooth();
		lastPoint = event.middlePoint;
	}
}

function onMouseUp(event) {
	if (currentStyle == THICKBRUSH) {
		var delta = event.point - lastPoint;
		delta.length = tool.maxDistance;
		addStrokes(event.point, delta);
		path.closed = true;
		path.smooth();
	}
}

function onKeyDown(event) {
	if (Key.isDown(']')) {
		stroke++;
	}

	if (Key.isDown('[')) {
		stroke--;
	}
}

function addStrokes(point, delta) {
	var step = delta.rotate(90);
	var strokePoints = strokeEnds * 2 + 1;
	point -= step / 2;
	step /= strokePoints - 1;
	for(var i = 0; i < strokePoints; i++) {
		var strokePoint = point + step * i;
		var offset = delta * (Math.random() * 0.3 + 0.1);
		if(i % 2) {
			offset *= -1;
		}
		strokePoint += offset;
		path.insert(0, strokePoint);
	}
}
