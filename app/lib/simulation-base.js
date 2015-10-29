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

module.exports = function (implementation) {

  let simulation = {
    initialize () {},
    simulate() {},
    draw () {}
  };

  simulation = _.extend(simulation, implementation);

  let ctx = false;
  let imageData = false;
  let WIDTH = false;
  let HEIGHT = false;

  let requestAnimationFrame = (window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    });
  let running = true;

  function animate () {
    if (!running) return;
    simulation.simulate();
    if (ctx && imageData) {
      simulation.draw(imageData.data);
      ctx.putImageData(imageData, 0, 0);
    }
    requestAnimationFrame(animate);
  }
  animate();

  return function (canvas, options) {

    WIDTH = options.columns || 128;
    HEIGHT = options.rows || 128;

    simulation.width = WIDTH;
    simulation.height = HEIGHT;

    ctx = canvas.getContext('2d');
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT);

    function resize () {}
    function velocityAt () {}
    function addWall () {}
    function addInlet () {}
    function stop () { running = false; }

    return {
      resize,
      velocityAt,
      addWall,
      addInlet,
      stop
    };
  };
};