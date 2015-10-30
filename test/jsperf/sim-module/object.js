var timeIt = {
  start: function () {
    this.start = new Date();
  },
  end: function () {
    this.end = new Date();
    console.log(this.end - this.start);
  }
}

var N = 1000*1000;
var field = new Float32Array(N);
var STEPS = 2000;

var simulation = {
  run: function () {
    var i, k;
    for (i=0; i < this.steps; i++) {
      for (k=0; k < this.N; k++) {
        this.field[k] = this.field[k] * 2.0 - 20.0;
      }
    }
  }
};

for (i=0; i < N; i++) {
  field[i] = i * 100.0;
}

simulation.N = N;
simulation.steps = STEPS;
simulation.field = field;

timeIt.start();
simulation.run();
timeIt.end();