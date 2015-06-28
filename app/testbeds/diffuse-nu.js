
/*

2015-03-16

Bigger grid and more density. Increase nu to compare.

*/
var engineInit = require('app/engines/init');
var diffuse = require('app/solvers/diffuse');

function init () {
  // width, height, step, nu, h
  engineInit(window, 50, 50, 0.1, 5.8, 0.5);
  
  for (let i = 15; i <= 35; i++) {
    for (let j = 15; j <= 35; j++) {
      u[I(i, j)] = 5.0;
      u_prev[I(i, j)] = 5.0;
    }
  }
  
}

let i;

function simulate () {
  diffuse(u, u_prev);
  for (i = 0; i < u.length; i++) { u_prev[i] = u[i]; }
}

let options = {
  width: 400,
  height: 400,
  title: 'Big Diffusion nu=0.8'
};

module.exports = {
  options,
  init,
  simulate
};