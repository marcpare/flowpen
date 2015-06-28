module.exports = function (d, WIDTH, HEIGHT, u, v, p) {
  let x, y, di, pi, ui;
  for(y = 0; y < HEIGHT; y++) {
    for(x = 0; x < WIDTH; x++) {
      pi = (y*WIDTH+x);
      ui = pi*2;
      di = pi*4;
      d[di+0] = p[pi]*555;
      d[di+1] = u[pi]*128+128;
      d[di+2] = v[pi]*128+128;
    }
  }
};