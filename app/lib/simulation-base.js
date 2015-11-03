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

    this.velocityField0 = new Float32Array(N*2);
    this.velocityField1 = new Float32Array(N*2);
    this.pressureField0 = new Float32Array(N);
    this.pressureField1 = new Float32Array(N);
    this.divergenceField = new Float32Array(N);
    this.step = 4.0;

    fill(this.pressureField0, 0.0);
    fill(this.pressureField1, 0.0);
    fill(this.velocityField0, 0.0);
    fill(this.velocityField1, 0.0);

    // TODO: do these get replace with macros or functions, or..?
    // u0x = sampler(velocityField0, WIDTH, HEIGHT, 2, 0),
    // u0y = sampler(velocityField0, WIDTH, HEIGHT, 2, 1),
    // u1x = sampler(velocityField1, WIDTH, HEIGHT, 2, 0),
    // u1y = sampler(velocityField1, WIDTH, HEIGHT, 2, 1),
    // p0 = sampler(pressureField0, WIDTH, HEIGHT, 1, 0),
    // p1 = sampler(pressureField1, WIDTH, HEIGHT, 1, 0),
    // div = sampler(divergenceField, WIDTH, HEIGHT, 1, 0),
    // velocityboundary(u0x, u0y);

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