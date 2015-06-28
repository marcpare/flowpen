let AmpersandView = require('ampersand-view');
let StamWagnerSimulation = require('app/lib/stam-wagner-simulation');

module.exports = AmpersandView.extend({
  template: require('app/components/simulation/simulation.jade'),
  
  initialize (options) {
    this.simulationOptions = options.simulationOptions;
  },
  
  startSimulation () {
    StamWagnerSimulation(this.query('#c'), this.simulationOptions);
  },
  
  render () {
    this.renderWithTemplate(this);
    
    // Hack for now that makes sure the element
    // is attached to the dom before kicking
    // off the simulation
    window.setTimeout(this.startSimulation.bind(this), 300);
    
    return this;
  }
});