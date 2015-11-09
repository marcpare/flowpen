module.exports = {

  solver: 'xie-fluids',

  visualizer: 'cool',

  safeMode: true,

  simulationDefaults: {

    relaxationSteps: 5,

    // Air's kinematic viscosity = 1.568 x 10^-5 m^2/s at 27 C
    viscosity: 0.001 * 0.00001568,

    timeStep: 0.1,

    // meters / cell
    cellSide: 10 / 128,

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

    steps: 4.0

  }

};