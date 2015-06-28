/*

2015-03-17

Full simulation.

*/
let engineInit = require('app/engines/init');
let maccormack = require('app/solvers/maccormack');
let conserve = require('app/solvers/conserve');
let diffuse = require('app/solvers/diffuse');
let copy = require('app/solvers/copy');

function init () {
  // width, height, step, nu, h
  engineInit(global, 160, 80, 0.2, 0.3, 1.0);
  sources();
}

function sources () {
  u[I(5, 40)] = 15.0;
  u_prev[I(5, 40)] = 15.0;
  
  v[I(40, 5)] = 15.0;
  v_prev[I(40, 5)] = 15.0;
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
  copy(u, u_prev);
  copy(v, v_prev);
  
  conserve();
  copy(u, u_prev);
  copy(v, v_prev);
  
}

let options = {
  width: 800,
  height: 400,
  title: 'Full simulation'
};

module.exports = {
  options,
  init,
  simulate
};