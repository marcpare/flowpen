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

      // TODO: implement; then see if it works!
      // applyBoundary(b, f);
    }
  }

  simulate () {

    // b: direction
    //   1 horizontal (x)
    //   2 vertical (y)

    if (this.viscosity > 0) { // viscid
      this.diffuse(this.u1x, this.u0x);
      this.diffuse(this.u1y, this.u0y);
    }

  }

}

module.exports = XieFluids;