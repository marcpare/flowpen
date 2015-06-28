/*

global: the global scope object to attach to
width: simulation width
height: simulation height
step: time step [s]
nu: kinematic viscosity of the fluid [m^2/s]
h: length of a cell side [m]

*/

let init = function (global, width, height, step, nu, h) {
  let N      = width*height;
  let u      = new Float32Array(N); // x velocity
  let u_prev = new Float32Array(N);
  let v      = new Float32Array(N); // y velocity
  let v_prev = new Float32Array(N);
  let phi    = new Float32Array(N); // poisson equation gradient field
  let div    = new Float32Array(N); // divergence
  let _h     = 1.0 / h; // inverse of cell side
  
  function fill (arr, val) {
    for (let i=0; i < arr.length; i++) arr[i] = val;
  }
  
  fill(u, 0.0);
  fill(u_prev, 0.0);
  fill(v, 0.0);
  fill(v_prev, 0.0);
  fill(phi, 0.0);
  fill(div, 0.0);
  
  function I (x, y) {
    return x+y*width;
  }
  
  global.N = N;
  global.u = u;
  global.u_prev = u_prev;
  global.v = v;
  global.v_prev = v_prev;
  global.phi = phi;
  global.div = div;
  global.h = h;
  global._h = _h;
  global.nu = nu;
  global.step = step;
  global.width = width;
  global.height = height;
  
  global.fill = fill;
  global.I = I;
};

module.exports = init;