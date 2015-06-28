let AmpersandView = require('ampersand-view');
let StamWagnerSimulation = require('app/lib/stam-wagner-simulation');

module.exports = AmpersandView.extend({
  template: require('app/components/simulation/simulation.jade'),
  
  render () {
    this.renderWithTemplate(this);
    StamWagnerSimulation(this.query('#c'));
    return this;
  }
});