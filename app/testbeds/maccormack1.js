/*

2015-03-15

The velocity moves forward as you would expect.

Fixed a bug with the vertical direction, which happened
to fix the numerical problems with the horizontal
direction at the edges.

*/
var engineInit = require('app/engines/init');
var maccormack = require('app/solvers/maccormack');

function init () {
  // width, height, step, nu, h
  engineInit(window, 10, 10, 0.1, 0.1, 0.5);
  // v[I(2, 2)] = 5.0;
  // v_prev[I(2, 2)] = 5.0;
  u[I(2, 2)] = 5.0;
  u_prev[I(2, 2)] = 5.0;
}


function simulate () {
  maccormack(u_prev, u);
  maccormack(v_prev, v);
}

let options = {
  width: 400,
  height: 400,
  title: 'MacCormack Advection'
};

module.exports = {
  options,
  init,
  simulate
};