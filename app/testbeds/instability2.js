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
  engineInit(global, 160, 80, 0.01, 0.001, 1.0);  
  sources();
}

function sources () {
  u[I(5, 40)] = 35.0;  
  u[I(5, 41)] = 35.0;  
  u[I(5, 42)] = 35.0;  
  u[I(5, 43)] = 35.0;  
  
  copy(u, u_prev);
  copy(v, v_prev);
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
  title: 'Instability 2'
};

module.exports = {
  options,
  init,
  simulate
};