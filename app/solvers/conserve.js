/*

Converse makes the simulation mass-conversing by solving the Poisson equation.

Mass conversation is achieved via the continuity condition div(V)=0 (divergence-free velocity field).

This requires solving a system of equations using Gauss-Sidel relaxation.

*/

let applyBoundary = require('app/solvers/apply-boundary');

function conserve () {
  let i, j, k, s;
  let i2dx = 0.5 / h;
  let i2dy = 0.5 / h;
  let idxsq = 1.0 / (h*h);
  let idysq = 1.0 / (h*h);
  let relaxationSteps = 20;
  
  for (i = 1; i < width-1; i++) {
    for (j = 1; j < height-1; j++) {
      div[I(i,j)] = (u[I(i + 1,j)] - u[I(i - 1,j)]) * i2dx + 
                    (v[I(i,j + 1)] - v[I(i,j - 1)]) * i2dy;
      phi[I(i,j)] = 0;
    }
  }

  applyBoundary(div);
  applyBoundary(phi);

  s = 0.5 / (idxsq + idysq);

  for (k = 0; k < relaxationSteps; k++) {
    for (i = 1; i < width-1; i++) {
      for (j = 1; j < height-1; j++) {
        phi[I(i,j)] = s * ((phi[I(i - 1,j)] + phi[I(i + 1,j)]) * idxsq + 
                           (phi[I(i,j - 1)] + phi[I(i,j + 1)]) * idysq - div[I(i,j)]);
      }
    }
  }

  for (i = 1; i < width-1; i++) {
    for (j = 1; j < height-1; j++) {
      u[I(i,j)] -= (phi[I(i + 1,j)] - phi[I(i - 1,j)]) * i2dx;
      v[I(i,j)] -= (phi[I(i,j + 1)] - phi[I(i,j - 1)]) * i2dy;
    }
  }

  applyBoundary(u);
  applyBoundary(v);
  
}

module.exports = conserve;