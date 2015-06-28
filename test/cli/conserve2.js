/*

2015-03-04

We get the same cool circle of action, but the velocity damps
almost instantly.

Would be interesting to see how maccormack vs. backtrack look 
in a real viz.

*/
require('babel/register');
var init = require('app/engines/init');
var advect_backtrace = require('app/solvers/advect_backtrace');
var conserve = require('app/solvers/conserve');
var printGrid = require('app/printGrid');

// width, height, step, nu, h
init(global, 20, 8, 0.1, 0.1, 0.5);

u[I(10, 2)] = 5.0;

// add a conserve step at the top to see if it helps.
conserve();

function simulate () {
  advect_backtrace(u, u_prev);
  advect_backtrace(v, v_prev);
  conserve();
}

for (var i = 0; i < 10; i++) {
  printGrid(u, width, height);
  simulate();
}