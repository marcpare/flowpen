/*

2015-03-04

Comparing conserve1 to maccormack1, you see that conserve creates
a bunch of action in a circle around the initial velocity. It
also fixes the blow up of the velocity when it gets near the
wall.

*/
require('babel/register');
var init = require('app/engines/init');
var maccormack = require('app/solvers/maccormack');
var conserve = require('app/solvers/conserve');
var printGrid = require('app/printGrid');

// width, height, step, nu, h
init(global, 20, 8, 0.1, 0.1, 0.5);

u[I(10, 2)] = 5.0;

function simulate () {
  maccormack(u_prev, u);
  maccormack(v_prev, v);
  conserve();
}

for (var i = 0; i < 10; i++) {
  printGrid(u, width, height);
  simulate();
}