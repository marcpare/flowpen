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

module.exports = function (options) {
  return function (canvas, options) {

    function resize () {}
    function velocityAt () {}
    function addWall () {}
    function addInlet () {}
    function stop () {}

    return {
      resize,
      velocityAt,
      addWall,
      addInlet,
      stop
    };
  };
};