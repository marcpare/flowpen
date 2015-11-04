let SimulationBase = require('app/lib/simulation-base');

class StamWagner2 extends SimulationBase {

  initialize (canvas, options) {
    super.initialize(canvas, options);

    for(let i=0; i < this.N; i++) {
      this.u0x[i] = (Math.random()-0.5)*10.0;
      this.u0y[i] = (Math.random()-0.5)*10.0;
    }
  }

  advect (ux, uy, src, dest, t) {

  }

  simulate () {
    this.velocityboundary(this.u0x, this.u0y);
    this.advect(this.u0x, this.u0y, this.u0x, this.u1x, this.step);
    this.advect(this.u0x, this.u0y, this.u0y, this.u1y, this.step);

    [this.p0, this.p1] = [this.p1, this.p0];
    [this.u0x, this.u1x] = [this.u1x, this.u0x];
    [this.u0y, this.u1y] = [this.u1y, this.u0y];
  }

  // TODO: factor this out into a visualization module and inject it
  draw () {
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
  }
}

module.exports = StamWagner2;