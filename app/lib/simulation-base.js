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
let fill = require('app/lib/arrays/fill');

let requestAnimationFrame = (window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  window.oRequestAnimationFrame      ||
  window.msRequestAnimationFrame     ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  });

let I = () => {};

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

    this.ctx.fillRect(0, 0, this.width, this.height);

    let N = this.width*this.height;
    this.N = N;
    this.isFluid = new Array(N);
    fill(this.isFluid, true);

    this.inletVelocityField = new Float32Array(N*2);
    fill(this.inletVelocityField, 0.0);

    this.u0x = new Float32Array(N);
    this.u0y = new Float32Array(N);
    this.u1x = new Float32Array(N);
    this.u1y = new Float32Array(N);
    this.p0 = new Float32Array(N);
    this.p1 = new Float32Array(N);
    this.div = new Float32Array(N);

    this.step = 4.0;

    fill(this.u0x, 0.0);
    fill(this.u0y, 0.0);
    fill(this.u1x, 0.0);
    fill(this.u1y, 0.0);
    fill(this.p0, 0.0);
    fill(this.p1, 0.0);
    fill(this.div, 0.0);

    // Indexing function for the flattened 2D arrays
    I = (x, y) => { return y*N + x; };
  }

  // Set the velocity to zero along the edges of the simulation
  // ux: x velocity
  // uy: y velocity
  velocityboundary (ux, uy) {
    let i;
    for (i = 0; i < this.width; i++) {
      ux[I(i, 0)] = 0;
      uy[I(i, 0)] = 0;
      ux[I(i, this.height-1)] = 0;
      uy[I(i, this.height-1)] = 0;

    }
    for (i = 0; i < this.height; i++) {
      ux[I(0, i)] = 0;
      uy[I(0, i)] = 0;
      ux[I(this.width-1, i)] = 0;
      uy[I(this.width-1, i)] = 0;
    }
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