require('babel/register');
var init = require('app/engines/init');
var maccormack = require('app/solvers/maccormack');
var printGrid = require('app/printGrid');

// width, height, step, nu, h
init(global, 20, 8, 0.1, 0.1, 0.5);

u[I(10, 2)] = 5.0;

function simulate () {
  maccormack(u_prev, u);
  maccormack(v_prev, v);
}

for (var i = 0; i < 10; i++) {
  printGrid(u, width, height);
  simulate();
}