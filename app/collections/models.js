let Model = require('app/models/model.js');

let db = [
  {
    id: 1,
    title: 'diffusion1',
    solver: 'diffusion',
    width: 256,
    height: 128,
    step: 0.01,
    nu: 0.1,
    h: 1.0,
    init: [
      {
        type: 'setter',
        varName: 'u',
        i: 15,
        j: 15,
        value: 100.0
      }
    ]
  },
  {
    id: 2,
    title: 'advect1',
    solver: 'advect',
    width: 256,
    height: 128,
    step: 0.01,
    nu: 0.01,
    h: 1.0,
    init: [
      {
        type: 'setter',
        varName: 'u',
        i: 15,
        j: 15,
        value: 1.0
      },
      {
        type: 'setter',
        varName: 'u',
        i: 16,
        j: 15,
        value: 100.0
      }
    ]
  }
];

let Models = {
  byId (id) {
    return new Model(db[id-1]);
  }
};

module.exports = Models;