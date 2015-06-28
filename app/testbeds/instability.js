/*

2015-03-17

Full simulation.

*/
let engineInit = require('app/engines/init');
let maccormack = require('app/solvers/maccormack');
var advect_backtrace = require('app/solvers/advect_backtrace');
let conserve = require('app/solvers/conserve');
let diffuse = require('app/solvers/diffuse');
let copy = require('app/solvers/copy');

let brownian;

function init () {
  // width, height, step, nu, h
  engineInit(global, 160, 80, 0.3, 0.01, 1.0);
  
  // generate brownian motion [-0.1, 0.1]
  brownian = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    brownian[i] = (Math.random()*2-1) / 100;
  }
  
  sources();
}

function sources () {
  u[I(5, 40)] = 35.0;
  
  for (let i = 1; i < width-1; i++) {
    for (let j = 1; j < height-1; j++) {
      u[I(i, j)] += brownian[I(i,j)];
      v[I(i, j)] += brownian[I(i,j)];
    }
  }
  copy(u, u_prev);
  copy(v, v_prev);
}

function simulate () {
  
  sources();
  
  // diffuse(u, u_prev);
  // diffuse(v, v_prev);
  // copy(u, u_prev);
  // copy(v, v_prev);
  
  // conserve();
  // copy(u, u_prev);
  // copy(v, v_prev);
  
  // maccormack(u_prev, u);
  // maccormack(v_prev, v);
  
  advect_backtrace(u, u_prev);
  advect_backtrace(v, v_prev);
  
  copy(u, u_prev);
  copy(v, v_prev);
  
  conserve();
  copy(u, u_prev);
  copy(v, v_prev);
  
}

let options = {
  width: 800,
  height: 400,
  title: 'Instability'
};

module.exports = {
  options,
  init,
  simulate
};