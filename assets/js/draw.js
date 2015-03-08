var PENCIL = "PENCIL";
var THICKBRUSH = "THICKBRUSH";
var VARIABLEBRUSH = "VARIABLEBRUSH";

var path;
var currentStyle = PENCIL;
var stroke = 1;
var opacity = 100;
var color = '#000000';
var lastPoint;
var strokeEnds = 6;
var currentSlider = "none";

// Brush buttons
var pencilButton = document.getElementById("pencilButton");
pencilButton.onclick = function(){ selectButton("#pencilButton") };
var wideBrushButton = document.getElementById("wideBrushButton");
wideBrushButton.onclick = function(){ selectButton("#wideBrushButton") };
var thinBrushButton = document.getElementById("thinBrushButton");
thinBrushButton.onclick = function(){ selectButton("#thinBrushButton") };

// Save and delete buttons
var saveButton = document.getElementById("saveButton");
saveButton.onclick = function(){ downloadAsSVG(); };
var deleteButton = document.getElementById("deleteButton");
deleteButton.onclick = function(){ window.location.reload() };

// Size and opacity display
var sizeField = document.getElementById("size");
var opacityField = document.getElementById("opacity");
sizeField.innerHTML = stroke;
opacityField.innerHTML = opacity;

// Size and opacity sliders
var sizeSlider = document.getElementById("weightSlider");
var opacitySlider = document.getElementById("opacitySlider");
sizeSlider.value = stroke;
opacitySlider.value = opacity;
sizeSlider.oninput = function(){ setStroke(sizeSlider.value); };
opacitySlider.oninput = function(){ setOpacity(opacitySlider.value); };

$('.picker').colpick({
	layout:'hex',
	onChange:function(hsb,hex,rgb,el,bySetColor) {
		updateColor(hex);
	}
});

function updateColor(hex) {
	var colorButton = document.getElementById("colorButton");
	$(".icon", colorButton).attr('style', "fill:#" + hex);
	color = "#" + hex;
}

function selectButton(button) {
	deselectAll();
	$svg = $(button);
	$(".icon", $svg).attr('style', "fill:" + "black");
	switch(button) {
		case "#pencilButton":
			currentStyle = PENCIL;
			tool.fixedDistance = 0;
			tool.minDistance = 0;
			tool.maxDistance = 0;
			break;
		case "#wideBrushButton":
			currentStyle = THICKBRUSH;
			tool.fixedDistance = 30;
			tool.minDistance = 30;
			tool.maxDistance = 30;
			break;
		case "#thinBrushButton":
			currentStyle = VARIABLEBRUSH;
			tool.fixedDistance = 0;
			tool.minDistance = 10;
			tool.maxDistance = 45;
			break;
		default:
			currentStyle: PENCIL;
	}
}

function deselectAll() {
	$(".icon", pencilButton).attr('style', "fill: #789178");
	$(".icon", wideBrushButton).attr('style', "fill: #789178");
	$(".icon", thinBrushButton).attr('style', "fill: #789178");
}

// tool.fixedDistance = 30;

function onMouseDown(event) {
	path = new Path();

	if (currentStyle == PENCIL) {
		path.strokeColor = color;
		path.strokeWidth = stroke;
	}

	if (currentStyle == THICKBRUSH) {
		path.fillColor = color;
		tool.fixedDistance = stroke * 10;
		tool.minDistance = stroke * 10;
		tool.maxDistance = stroke * 10;
	}

	if (currentStyle == VARIABLEBRUSH) {
		path.fillColor = color;
		tool.fixedDistance = 0;
		tool.minDistance = 10;
		tool.maxDistance = stroke * 15;
		path.add(event.point);

	}

	path.opacity = opacity/100;
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

	if (currentStyle == VARIABLEBRUSH) {
		var step = event.delta / 2;
		step.angle += 90;
		
		var top = event.middlePoint + step;
		var bottom = event.middlePoint - step;
		
		path.add(top);
		path.insert(0, bottom);
		path.smooth();
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

	if (currentStyle == VARIABLEBRUSH) {
		path.add(event.point);
		path.closed = true;
		path.smooth();
	}
}

function onKeyDown(event) {
	if (Key.isDown(']')) {
		setStroke(stroke + 1);
	}

	if (Key.isDown('[')) {
		setStroke(stroke - 1);
	}

	if (Key.isDown('}')) {
		setOpacity(opacity + 1);
	}

	if (Key.isDown('{')) {
		setOpacity(opacity - 1);
	}
}

function setStroke(value) {
	if ((value > 0) && (value < 101)) {
		stroke = value;
		sizeField.innerHTML = stroke;
		sizeSlider.value = stroke;
	}

	return stroke;
}

function setOpacity(value) {
	if ((value > 0) && (value < 101)) {
		opacity = value;
		opacityField.innerHTML = opacity;
		opacitySlider.value = opacity;
	}

	return opacity;
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

function downloadAsSVG(fileName) {

	if(!fileName) {
	   fileName = "drawing.svg"
	}

	var svg = paper.project.exportSVG({asString: true});
	var blob = new Blob([svg], {type: "image/svg+xml;charset=utf-8"});
	saveAs(blob, fileName);
}

function get_nextsibling(n) {
	x=n.nextSibling;
	
	while (x.nodeType!=1) {
		x=x.nextSibling;
	}

	return x;
}

function showValue(self) {
	get_nextsibling(self).innerHTML=self.value;
}

selectButton("#pencilButton");
updateColor(color);
