/*

2015-03-04

Comparing conserve1 to maccormack1, you see that conserve creates
a bunch of action in a circle around the initial velocity. It
also fixes the blow up of the velocity when it gets near the
wall.

*/
var engineInit = require('app/engines/init');
var maccormack = require('app/solvers/maccormack');
var conserve = require('app/solvers/conserve');

function init () {
  // width, height, step, nu, h
  engineInit(global, 20, 20, 0.1, 0.1, 0.5);
  u[I(10, 2)] = 5.0;
  u_prev[I(10, 2)] = 5.0;  
  
  v[I(10, 2)] = 5.0;
  v_prev[I(10, 2)] = 5.0;  
}

function simulate () {
  maccormack(u_prev, u);
  maccormack(v_prev, v);
  conserve();
}

let options = {
  width: 400,
  height: 400,
  title: 'MacCormack + Conserve 1'
};

module.exports = {
  options,
  init,
  simulate
};