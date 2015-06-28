/*

node test/cli/advect_backtrace1.js

Amazing that this solver doesn't seem to work at all.

All the velocity goes to zero after the first time step.

If you read the code, it makes sense why it wouldn't work. The 
solver only looks backwards. It will never move a velocity
forwards.

Perhaps when you combine it with projection, it will behave in
a convincing manner?

Further, even if it does, does it model the fluid with enough
quantitative accuracy? Or does it turn out that the Stam solver
is just a convincing fake?

*/
require('babel/register');
var init = require('app/engines/init');
var advect_backtrace = require('app/solvers/advect_backtrace');
var printGrid = require('app/printGrid');

// width, height, step, nu, h
init(global, 20, 8, 0.1, 0.1, 0.5);

for (var i = 1; i < 7; i++) {
  for (var j = 6; j < 12; j++) {
    u[I(i, j)] = 5.0;
    u_prev[I(i, j)] = 5.0;
  }
}

function simulate () {
  advect_backtrace(u, u_prev);
  advect_backtrace(v, v_prev);
}

for (var i = 0; i < 10; i++) {
  printGrid(u, width, height);
  simulate();
}