let AmpersandView = require('ampersand-view');
let StamWagnerSimulation = require('app/lib/stam-wagner-simulation');

module.exports = AmpersandView.extend({
  template: require('app/components/simulation/simulation.jade'),
  
  render () {
    this.renderWithTemplate(this);
    
    // Hack for now that makes sure the element
    // is attached to the dom before kicking
    // off the simulation
    window.setTimeout(() => {
      StamWagnerSimulation(this.query('#c'));  
    }, 300);
    
    return this;
  }
});