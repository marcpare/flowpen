var geom = require('app/geom.js');

function Wall (line) {
  this.line = line;
  this.render();
}

Wall.prototype.render = function () {  
  this.applyToSim();
  this.line.append(APP.overlaygSnap).attr({
    stroke: '#bada55',
    strokeWidth: 4,
    strokeLinecap: 'round'
  });
};

Wall.prototype.applyToSim = function () {
  var x, y, dist;
  // set the flags for the sim.
  for (x = 0; x < WIDTH; x++) {
    for (y = 0; y < HEIGHT; y++) {
      dist = geom.distToSegment(geom.p(x,y), this.line);
      if (dist < 2) {
        wall(x, y, true);
      }
    }
  }
};

module.exports = Wall;