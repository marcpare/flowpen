let AmpersandView = require('ampersand-view');
let StamWagnerSimulation = require('app/lib/stam-wagner-simulation');
let WindowWatcher = require('window-watcher');

module.exports = AmpersandView.extend({
  template: require('app/components/simulation/simulation.jade'),
  
  initialize (options) {
    this.simulationOptions = options.simulationOptions;
    
    WindowWatcher.on('resize', this.recenter.bind(this));
  },
  
  startSimulation () {
    this.simulation = StamWagnerSimulation(this.query('#c'), this.simulationOptions);
    this.recenter();
  },
  
  recenter () {
    
    // Update the canvas position in the DOM
    let W = this.el.offsetWidth;
    let H = this.el.offsetHeight;
    let a = W / this.simulationOptions.columns;
    let b = H / this.simulationOptions.rows;
    let c = Math.min(a, b);
    
    let width = this.simulationOptions.columns * c;
    let height = this.simulationOptions.rows * c;
    
    width = Math.floor(width);
    height = Math.floor(height);
    
    this.elCanvas.style.width = `${width}px`;
    this.elCanvas.style.height = `${height}px`;
        
    let left = (W - width) / 2.0;
    let top = (H - height) / 2.0;
    
    left = Math.floor(left);
    top = Math.floor(top);
    
    this.elCanvas.style.marginTop = `${top}px`;
    this.elCanvas.style.marginLeft = `${left}px`;
    
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