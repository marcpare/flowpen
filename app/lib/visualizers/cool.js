module.exports = function () {
  let di, pi, ui, x, y, w, h, d;
  let I = this.I;
  w = this.width;
  h = this.height;
  d = this.imageData.data;
  for(y = 0; y < h; y++) {
    for(x = 0; x < w; x++) {
      pi = (y*w+x);
      ui = pi*2;
      di = pi*4;

      d[di+0] = this.p0[I(x, y)]*555;
      d[di+1] = this.u0x[I(x, y)]*128+128;
      d[di+2] = this.u0y[I(x, y)]*128+128;
    }
  }
};