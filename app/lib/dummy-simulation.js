let SimulationBase = require('app/lib/simulation-base');

class DummySimulation extends SimulationBase {
  draw () {
    let di, pi, ui, x, y, w, h, d;
    w = this.width;
    h = this.height;
    d = this.imageData.data;
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
}

module.exports = DummySimulation;