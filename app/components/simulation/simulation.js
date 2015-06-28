let AmpersandView = require('ampersand-view');
let StamWagnerSimulation = require('app/lib/stam-wagner-simulation');

module.exports = AmpersandView.extend({
  template: require('app/components/simulation/simulation.jade'),
  
  initialize (options) {
    this.simulationOptions = options.simulationOptions;
  },
  
  startSimulation () {
    this.simulation = StamWagnerSimulation(this.query('#c'), this.simulationOptions);
    this.recenter();
  },
  
  recenter () {
    
    // Update the canvas position in the DOM
    let a = this.el.offsetWidth / this.simulationOptions.columns;
    let b = this.el.offsetHeight / this.simulationOptions.rows;
    let c = Math.min(a, b);
    
    let width = this.simulationOptions.columns * c;
    let height = this.simulationOptions.rows * c;
    
    width = Math.floor(width);
    height = Math.floor(height);
    
    this.elCanvas.style.width = width + 'px';
    this.elCanvas.style.height = height + 'px';
    
    // Update the simulation globals
    this.simulation.resize();
    
  },
  
  render () {
    this.renderWithTemplate(this);
    
    // Hack for now that makes sure the element
    // is attached to the dom before kicking
    // off the simulation
    window.setTimeout(this.startSimulation.bind(this), 300);
    
    this.elCanvas = this.query('#c');
    
    return this;
  }
});