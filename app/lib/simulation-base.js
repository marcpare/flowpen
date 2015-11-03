//
// SimulationBase
//
// Fills in stubs for simulation functionality. Implementations fill in these stubs.
//
// Usage:
//
//   my-solver.js
//
//   simulationBase = require('simulation-base');
//   module.exports = simulationBase({
//
//     initialize () { ... }
//
//   })
//

let _ = require('underscore');

let requestAnimationFrame = (window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  window.oRequestAnimationFrame      ||
  window.msRequestAnimationFrame     ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  });

class SimulationBase {
  constructor () {
    this.running = false;
  }

  initialize (canvas, options) {
    this.width = options.columns || 128;
    this.height = options.row || 128;
    this.ctx = canvas.getContext('2d');
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
  }

  start () {
    this.running = true;
    this.animate();
  }

  animate () {
    if (!this.running) return;
    this.simulate();

    if (this.ctx && this.imageData) {
      this.draw();
      this.ctx.putImageData(this.imageData, 0, 0);
    }
    requestAnimationFrame(this.animate.bind(this));
  }

  simulate () {}

  resize () {}

  velocityAt () {}

  addWall () {}

  addInlet () {}

  stop () {
    this.running = false;
  }

}

module.exports = SimulationBase;