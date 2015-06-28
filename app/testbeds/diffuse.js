
/*

2015-03-16

Initial implementation. Appears to work!

*/
var engineInit = require('app/engines/init');
var diffuse = require('app/solvers/diffuse');

function init () {
  // width, height, step, nu, h
  engineInit(window, 10, 10, 0.1, 0.1, 0.5);
  u[I(4, 4)] = 5.0;
  u_prev[I(4, 4)] = 5.0;
}

let i;

function simulate () {
  diffuse(u, u_prev);
  for (i = 0; i < u.length; i++) { u_prev[i] = u[i]; }
}

let options = {
  width: 400,
  height: 400,
  title: 'Diffusion'
};

module.exports = {
  options,
  init,
  simulate
};