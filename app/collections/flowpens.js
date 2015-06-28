let AmpersandCollection = require('ampersand-collection');
let Flowpen = require('app/models/flowpen.js');
let testbeds = require('app/testbeds');
let _ = require('underscore');

let flowpens = new AmpersandCollection([], {
  mainIndex: 'id',
  model: Flowpen
});

for (let tb in testbeds) {
  let pen = new Flowpen({
    id: tb,
    title: testbeds[tb].options.title
  });
  _.extend(pen, testbeds[tb]);  
  flowpens.add(pen);
}

module.exports = flowpens;