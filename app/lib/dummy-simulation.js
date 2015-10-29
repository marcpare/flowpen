module.exports = require('app/lib/simulation-base')({
  draw (d) {
    let di, pi, ui, x, y, w, h;
    w = this.width;
    h = this.height;
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        pi = (y*w+x);
        ui = pi*2;
        di = pi*4;

        d[di+0] = 123;
        d[di+1] = 123;
        d[di+2] = 321;
      }
    }
  }
});