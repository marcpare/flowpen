module.exports = require('app/lib/simulation-base')({
  draw (width, height, d) {
    let di, pi, ui, x, y;
    for(y = 0; y < height; y++) {
      for(x = 0; x < width; x++) {
        pi = (y*width+x);
        ui = pi*2;
        di = pi*4;

        d[di+0] = 123;
        d[di+1] = 123;
        d[di+2] = 321;
      }
    }
  }
});