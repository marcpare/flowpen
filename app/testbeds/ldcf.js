/*

2015-03-17

Lid Drive Cavity Flow

*/
let engineInit = require('app/engines/init');
let maccormack = require('app/solvers/maccormack');
var advect_backtrace = require('app/solvers/advect_backtrace');
let conserve = require('app/solvers/conserve');
let diffuse = require('app/solvers/diffuse');
let copy = require('app/solvers/copy');

function sources () {
  let i;
  for (i = 1; i < width-1; i++) {
    u[I(i, 1)] = 15.0;
    u_prev[I(i, 1)] = 15.0;
  }
}

function init () {
  // width, height, step, nu, h
  engineInit(global, 80, 80, 0.05, 10.0001, 1.0);
  sources();
}

function simulate () {
  
  sources();
  
  diffuse(u, u_prev);
  diffuse(v, v_prev);
  copy(u, u_prev);
  copy(v, v_prev);
  
  conserve();
  copy(u, u_prev);
  copy(v, v_prev);
  
  maccormack(u_prev, u);
  maccormack(v_prev, v);
  
  // advect_backtrace(u, u_prev);
  // advect_backtrace(v, v_prev);
  
  copy(u, u_prev);
  copy(v, v_prev);
  
  conserve();
  copy(u, u_prev);
  copy(v, v_prev);
  
}

let options = {
  width: 400,
  height: 400,
  title: 'Lid Driven Cavity Flow'
};

module.exports = {
  options,
  init,
  simulate
};