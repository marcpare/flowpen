require('babel/register');
var stam = require('app/engines/stam');

// initialize a small grid...
var sim = stam(3, 3, 1.0, 1.0, 1.0);

// ...with some velocity in the center
sim.setter('u', 1, 1, 1.0);

// print grid
function printGrid () {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      process.stdout.write(sim.getter('u', i, j).toFixed(3) + ' ');
    }
    process.stdout.write("\n");
  }
  console.log('-----------------');
}

printGrid();

for (var i = 0; i < 10; i++) {
  sim.simulate();
  printGrid();  
}