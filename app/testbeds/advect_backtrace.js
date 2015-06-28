var testbed = require('app/testbed');
var engineInit = require('app/engines/init');
var advect_backtrace = require('app/solvers/advect_backtrace');
let copy = require('app/solvers/copy');
var conserve = require('app/solvers/conserve');


function init () {
  
  // width, height, step, nu, h
  engineInit(window, 10, 10, 0.1, 0.1, 0.5);

  sources();
}

function sources () {
  for (var i = 2; i < 4; i++) {
    for (var j = 3; j < 5; j++) {
      u[I(i, j)] = 1.0;
      u_prev[I(i, j)] = 1.0;
    }
  }
}

function simulate () {
  
  sources();
  
  for (let i = 1; i < width-1; i++) {
    for (let j = 1; j < height-1; j++) {
      u[I(i, j)] += 0.01;
      v[I(i, j)] += 0.01;
    }
  }
  
  advect_backtrace(u, u_prev);
  advect_backtrace(v, v_prev);
  
  copy(u, u_prev);
  copy(v, v_prev);
  
  conserve();
}

let options = {
  width: 400,
  height: 400,
  title: 'Advect Backtrace'
};

module.exports = {
  options,
  init,
  simulate
};