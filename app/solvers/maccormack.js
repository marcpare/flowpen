let applyBoundary = require('app/solvers/apply-boundary');

function maccormack (f0, f) {
  let tx, ty, i, j;

  tx = 0.5 * step / h;
  ty = 0.5 * step / h;
  
  for (i = 1; i < width-1; i++) {
    for (j = 1; j < height-1; j++) {
      f[I(i,j)] = f0[I(i,j)] - tx * (u_prev[I(i + 1,j)] * f0[I(i + 1,j)] - u_prev[I(i - 1,j)] * f0[I(i - 1,j)]) - ty * (v_prev[I(i,j + 1)] * f0[I(i,j + 1)] - v_prev[I(i,j - 1)] * f0[I(i,j - 1)]);
    }
  }

  applyBoundary(f);

  for (i = 1; i < width-1; i++) {
    for (j = 1; j < height-1; j++) {
      f0[I(i,j)] = 0.5 * (f0[I(i,j)] + f[I(i,j)]) - 0.5 * tx * u_prev[I(i,j)] * (f[I(i + 1,j)] - f[I(i - 1,j)])  - 0.5 * ty * v_prev[I(i,j)] * (f[I(i,j + 1)] - f[I(i,j - 1)]);
    }
  }
  
  for (i = 0; i < f.length; i++) {
    f[i] = f0[i];
  }

  applyBoundary(f);

}

module.exports = maccormack;