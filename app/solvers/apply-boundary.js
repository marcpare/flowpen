function applyBoundary (f) {
  let i;
  for (i = 1; i <= width-1; i++) {
    f[I(i, 0)] = 0.0;
    f[I(i, height-1)] = 0.0;
  }
  for (i = 1; i <= height-1; i++) {
    f[I(0, i)] = 0.0;
    f[I(width-1, i)] = 0.0;
  }
}

module.exports = applyBoundary;