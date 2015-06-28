let applyBoundary = require('app/solvers/apply-boundary');

/*
Diffuse to x from x0

Finds the density which when diffused backward in time yield the 
density we started with.
*/

function diffuse (x, x0) {
  let i, j, k, a, w0, w1, w2, w3;
  a = step*nu*_h*_h;
  for (k=0; k < 20; k++) {
    for (i=1; i < width; i++) {
      for (j=1; j< height; j++) {
        w0 = x[I(i-1, j)];
        w1 = x[I(i+1, j)];
        w2 = x[I(i, j-1)];
        w3 = x[I(i, j+1)];
        x[I(i,j)] = (x0[I(i,j)] + a * (w0 + w1 + w2 + w3)) / (1+4*a);
      }
    }
    applyBoundary(x);
  }
}

module.exports = diffuse;