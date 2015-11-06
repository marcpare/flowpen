module.exports = {

  solver: 'stam-wagner-2',

  simulationDefaults: {

    // Fill the pen with random velocities
    randomStart: true,

    // The indexer will check if the provided coordinates are in bounds.
    // Meant for debugging, since it will slow down the simulation.
    indexerBoundsCheck: true,

    defaultRows: 128,

    defaultColumns: 128,

    // Add an additional delay between animation frames. Usually for
    // slowing down a fast running animation
    frameDelay: false,

    steps: 4.0,

    solver: 'stam-wagner-2'

  }

};