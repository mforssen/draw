var myPath;
	var stroke = 1;

	function onMouseDown(event) {
		myPath = new Path();
		myPath.strokeColor = 'black';
		myPath.strokeWidth = stroke;
	}

	function onMouseDrag(event) {
		myPath.add(event.point);
	}

	function onKeyDown(event) {
		if (Key.isDown(']')) {
			stroke++;
		}

		if (Key.isDown('[')) {
			stroke--;
		}
	}