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
let config = require('app/config');
let visualizers = require('app/lib/visualizers');

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

    this.bilerp = require('app/lib/numerical/bilerp');
  }

  initialize (canvas, options) {
    this.width = options.columns || config.simulationDefaults.defaultColumns;
    this.height = options.row || config.simulationDefaults.defaultRows;
    this.ctx = canvas.getContext('2d');
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);

    let N = this.width*this.height;
    let W = this.width;
    let H = this.height;
    this.N = N;
    this.nx = this.width;
    this.ny = this.height;
    this.nx1 = this.nx - 1;
    this.ny1 = this.ny - 1;
    this.nx2 = this.nx - 2;
    this.ny2 = this.ny - 2;
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

    this.step = config.simulationDefaults.steps;

    fill(this.u0x, 0.0);
    fill(this.u0y, 0.0);
    fill(this.u1x, 0.0);
    fill(this.u1y, 0.0);
    fill(this.p0, 0.0);
    fill(this.p1, 0.0);
    fill(this.div, 0.0);

    // Indexing function for the flattened 2D arrays
    if (config.simulationDefaults.indexerBoundsCheck) {
      I = (x, y) => {
        if (!this.inBounds(x, y)) {
          throw "Index out of bounds";
        }
        return y*W + x;
      };
    } else {
      I = (x, y) => { return y*W + x; };
    }

    this.I = I;

    if (config.simulationDefaults.randomStart) {
      let i;
      for(i=0; i < this.N; i++) {
        this.u0x[i] = (Math.random()-0.5)*10.0;
        this.u0y[i] = (Math.random()-0.5)*10.0;
        this.u1x[i] = this.u0x[i];
        this.u1y[i] = this.u1y[i];
      }
    }

    this.draw = visualizers[config.visualizer];

    this.viscosity = config.simulationDefaults.viscosity;

    this.deltaX = config.simulationDefaults.cellSide / this.width;
    this.deltaY = config.simulationDefaults.cellSide / this.height;
    this.i2dx = 0.5 / this.deltaX;
    this.i2dy = 0.5 / this.deltaY;
    this.idxsq = 1.0 / (this.deltaX * this.deltaX);
    this.idysq = 1.0 / (this.deltaY * this.deltaY);

    this.relaxationSteps = config.simulationDefaults.relaxationSteps;

    this.timeStep = config.simulationDefaults.timeStep;

    // Safety checks that configuration worked
    console.assert(this.timeStep);
    console.assert(this.relaxationSteps);
    console.assert(this.viscosity);
    console.assert(this.idxsq);
    console.assert(this.deltaX);

    this.safeMode = config.safeMode;

    if (this.everySecond) {
      window.setInterval(this.everySecond.bind(this), 1000);
    }
  }

  inBounds (x, y) {
    return (x >= 0 && y >= 0 && y < this.height && x < this.width);
  }

  copy (dst, src) {
    for (let i = 0, N = src.length; i < N; i++) {
      dst[i] = src[i];
    }
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

  runSafetyChecks () {
    let checkNaN = (arr) => {
      for (let i = 0, N = arr.length; i < N; i++) {
        if (isNaN(arr[i])) throw "Failed NaN safety check";
      }
    };
    checkNaN(this.u0x);
    checkNaN(this.u0y);
    checkNaN(this.u1x);
    checkNaN(this.u1y);

  }

  start () {
    this.running = true;
    this.animate();
  }

  animate () {
    if (!this.running) return;
    this.simulate();

    if (this.safeMode) {
      this.runSafetyChecks();
    }

    if (this.ctx && this.imageData) {
      this.draw();
      this.ctx.putImageData(this.imageData, 0, 0);
    }

    if (config.simulationDefaults.frameDelay) {
      window.setTimeout(() => {
        requestAnimationFrame(this.animate.bind(this));
      }, config.simulationDefaults.frameDelay);
    } else {
      requestAnimationFrame(this.animate.bind(this));
    }
  }

  simulate () {
    this.velocityboundary(this.u0x, this.u0y);
  }

  resize () {}

  velocityAt () {}

  addWall () {}

  addInlet () {}

  stop () {
    this.running = false;
  }

}

module.exports = SimulationBase;