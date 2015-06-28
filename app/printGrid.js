function printGrid (d, width, height) {
	for (var j = 0; j < height; j++) {
		for (var i = 0; i < width; i++) {
			process.stdout.write(d[i+j*width].toFixed(3) + ' ');
		}
		process.stdout.write("\n");
	}
	console.log('-----------------');
}

module.exports = printGrid;