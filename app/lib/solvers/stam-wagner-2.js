let SimulationBase = require('app/lib/solvers/base');

class StamWagner2 extends SimulationBase {

  initialize (canvas, options) {
    super.initialize(canvas, options);
  }

  advect (ux, uy, src, dest, t) {
    let x, y, vx, vy, I=this.I;
    for(y=1; y < this.height-1; y++) {
      for(x=1; x < this.width-1; x++) {
        vx = x + ux[I(x, y)]*t;
        vy = y + uy[I(x, y)]*t;
        if (this.inBounds(vx, vy) && this.inBounds(vx+1, vy+1)) {
          dest[I(x, y)] = this.bilerp(src, vx, vy);
        }
      }
    }
  }

  computeDivergence (ux, uy, div) {
    let x, y, x0, x1, y0, y1, I=this.I;
    for(y=1; y < this.height-1; y++) {
      for(x=1; x < this.width-1; x++) {
        // compute divergence using central difference
        x0 = ux[I(x-1, y)];
        x1 = ux[I(x+1, y)];
        y0 = uy[I(x, y-1)];
        y1 = uy[I(x, y+1)];
        div[I(x, y)] = (x1-x0 + y1-y0)*0.5;
      }
    }
  }

  // Needs an even number of iterations
  fastjacobi (p0, p1, b, alpha, beta, iterations) {
    let i, y, x, W=this.width, H=this.height, pi, x0, x1, y0, y1;
    for(i = 0; i < iterations; i++) {
      for(y = 1; y < H-1; y++) {
        for(x = 1; x < W-1; x++) {
          pi = x+y*W;
          x0 = p0[pi-1];
          x1 = p0[pi+1];
          y0 = p0[pi-W];
          y1 = p0[pi+W];
          p1[pi] = (x0 + x1 + y0 + y1 + alpha * b[pi]) * beta;
        }
      }
      [p0, p1] = [p1, p0];
    }
  }

  subtractPressureGradient (ux, uy, p) {
    let x, y, x0, x1, y0, y1, dx, dy, I=this.I;
    for(y = 1; y < this.height-1; y++) {
        for(x = 1; x < this.width-1; x++) {
          x0 = p[I(x-1, y)];
          x1 = p[I(x+1, y)];
          y0 = p[I(x, y-1)];
          y1 = p[I(x, y+1)];
          dx = (x1-x0)/2;
          dy = (y1-y0)/2;

          ux[I(x, y)] = ux[I(x, y)]-dx;
          uy[I(x, y)] = uy[I(x, y)]-dy;
      }
    }
  }


  simulate () {
    this.velocityboundary(this.u0x, this.u0y);
    this.advect(this.u0x, this.u0y, this.u0x, this.u1x, this.step);
    this.advect(this.u0x, this.u0y, this.u0y, this.u1y, this.step);
    this.computeDivergence(this.u1x, this.u1y, this.div);
    this.fastjacobi(this.p0, this.p1, this.div, -1, 0.25, 16);
    this.subtractPressureGradient(this.u1x, this.u1y, this.p0);

    [this.p0, this.p1] = [this.p1, this.p0];
    [this.u0x, this.u1x] = [this.u1x, this.u0x];
    [this.u0y, this.u1y] = [this.u1y, this.u0y];
  }

}

module.exports = StamWagner2;