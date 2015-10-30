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
var i, k;
var STEPS = 2000;

for (i=0; i < N; i++) {
  field[i] = i * 10.0;
}

timeIt.start();
for (i=0; i < STEPS; i++) {
  for (k=0; k < N; k++) {
    field[k] = field[k] * 2.0 - 20.0;
  }
}
timeIt.end()