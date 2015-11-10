//
// Ported from Dr. Charles Xie's Energy2D Solver (Java)
//
// http://energy.concord.org/energy2d/
//

let SimulationBase = require('app/lib/solvers/base');

class XieFluids extends SimulationBase {

  initialize (canvas, options) {
    super.initialize(canvas, options);
  }

  everySecond () {
    // console.log(this.u0x);
  }

  applyBoundary (ux, uy) {
    let I = this.I;
    let i;
    let nx1 = this.nx1, ny1 = this.ny1, nx2 = this.nx2, ny2 = this.ny2;

    // Flow type: STOP

    for (i = 1; i < nx1; i++) {
      // upper side
      ux[I(i, 0)] = ux[I(i, 1)];
      uy[I(i, 0)] = 0;
      // lower side
      ux[I(i, ny1)] = ux[I(i, ny2)];
      uy[I(i, ny1)] = 0;
    }

    for (i = 1; i < ny1; i++) {
      // left side
      ux[I(0, i)] = 0;
      uy[I(0, i)] = uy[I(1, i)];
      // right side
      ux[I(nx1, i)] = 0;
      uy[I(nx1, i)] = uy[I(nx2, i)];
    }

    // upper-left corner
    ux[I(0, 0)] = 0.5 * (ux[I(1, 0)] + ux[I(0, 1)]);
    uy[I(0, 0)] = 0.5 * (uy[I(1, 0)] + uy[I(0, 1)]);

    // upper-right corner
    ux[I(nx1, 0)] = 0.5 * (ux[I(nx2, 0)] + ux[I(nx1, 1)]);
    uy[I(nx1, 0)] = 0.5 * (uy[I(nx2, 0)] + uy[I(nx1, 1)]);

    // lower-left corner
    ux[I(0, ny1)] = 0.5 * (ux[I(1, ny1)] + ux[I(0, ny2)]);
    uy[I(0, ny1)] = 0.5 * (uy[I(1, ny1)] + uy[I(0, ny2)]);

    // lower-right corner
    ux[I(nx1, ny1)] = 0.5 * (ux[I(nx2, ny1)] + ux[I(nx1, ny2)]);
    uy[I(nx1, ny1)] = 0.5 * (uy[I(nx2, ny1)] + uy[I(nx1, ny2)]);
  }

  // f0: dst
  // f1: src
  diffuse (f0, f) {

    this.copy(f0, f);

    let I = this.I;
    let hx = this.timeStep * this.viscosity * this.idxsq;
    let hy = this.timeStep * this.viscosity * this.idysq;
    let dn = 1.0 / (1.0 + 2.0 * (hx + hy));
    let k, i, j;

    for (k = 0; k < this.relaxationSteps; k++) {
      for (i = 1; i < this.width - 1; i++) {
        for (j = 1; j < this.height - 1; j++) {
          f[I(i, j)] = (f0[I(i, j)] + hx * (f[I(i-1, j)] + f[I(i+1, j)]) + hy * (f[I(i, j-1)] + f[I(i, j+1)])) * dn;
        }
      }
      // TODO: *
      this.applyBoundary(this.u0x, this.u0y);
    }
  }

  // Enforce the continuity condition div(V)=0 (velocity field must be divergence-free to conserve mass) using
  // the relaxation method: http://en.wikipedia.org/wiki/Relaxation_method.
  // This procedure solves the Poisson equation.
  conserve (u, v, phi, div) {
    let I = this.I;
    let i, j, k;

    for (i = 1; i < this.nx1; i++) {
      for (j = 1; j < this.ny1; j++) {
        div[I(i, j)] = (u[I(i + 1, j)] - u[I(i - 1, j)]) * this.i2dx + (v[I(i, j + 1)] - v[I(i, j - 1)]) * this.i2dy;
        phi[I(i, j)] = 0;
      }
    }
    // TODO: *
    this.applyBoundary(phi, div);

    let s = 0.5 / (this.idxsq + this.idysq);

    for (k = 0; k < this.relaxationSteps; k++) {
      for (i = 1; i < this.nx1; i++) {
        for (j = 1; j < this.ny1; j++) {
          phi[I(i, j)] = s * ((phi[I(i - 1, j)] + phi[I(i + 1, j)]) * this.idxsq + (phi[I(i, j - 1)] + phi[I(i, j + 1)]) * this.idysq - div[I(i, j)]);
        }
      }
    }

    for (i = 1; i < this.nx1; i++) {
      for (j = 1; j < this.ny1; j++) {
        u[I(i, j)] -= (phi[I(i + 1, j)] - phi[I(i - 1, j)]) * this.i2dx;
        v[I(i, j)] -= (phi[I(i, j + 1)] - phi[I(i, j - 1)]) * this.i2dy;
      }
    }
    this.applyBoundary(u, v);
  }

  simulate () {

    // b: direction
    //   1 horizontal (x)
    //   2 vertical (y)

    if (this.viscosity > 0) { // viscid
      this.diffuse(this.u1x, this.u0x);
      this.diffuse(this.u1y, this.u0y);

      this.conserve(this.u0x, this.u0y, this.u1x, this.u1y);
    }

    // TODO: advect

  }

}

module.exports = XieFluids;