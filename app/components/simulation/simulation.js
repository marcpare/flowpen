let AmpersandView = require('ampersand-view');
let WindowWatcher = require('window-watcher');
let StamWagnerSimulation = require('app/lib/stam-wagner-simulation-obstacles');
let Cursor = require('app/models/cursor');
let EditorObjects = require('app/models/editor-objects');
let Bus = require('app/lib/bus');

module.exports = AmpersandView.extend({
  template: require('app/components/simulation/simulation.jade'),
  
  events: {
    'mousemove #c': 'mouseMove',
    'click #c': 'triggerClick'
  },
  
  mouseMove (e) {
    Cursor.x = e.offsetX;
    Cursor.y = e.offsetY;
  },
  
  triggerClick (e) {
    Bus.trigger('canvas-click', {
      x: e.offsetX,
      y: e.offsetY
    });
  },
  
  initialize (options) {
    this.simulationOptions = options.simulationOptions;
    
    WindowWatcher.on('resize', this.recenter.bind(this));
    this.listenTo(Cursor, 'change', this.updateCursor.bind(this));
    this.listenTo(EditorObjects, 'add', this.addObject.bind(this));
    this.listenTo(EditorObjects, 'remove', this.removeObject.bind(this));
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
    
    // Update the overlay svg dimensions to match the canvas
    this.elOverlay.style.width = this.elCanvas.style.width;
    this.elOverlay.style.height = this.elCanvas.style.height;
    this.elOverlay.style.marginTop = this.elCanvas.style.marginTop;
    this.elOverlay.style.marginLeft = this.elCanvas.style.marginLeft;
        
    // Update the simulation globals
    this.simulation.resize();
  
  },
  
  initializeSvg () {
        
    // Initialize svg overlay and elements
    this.svgOverlay = Snap('#overlay');
    
    this.svgTraceNode = this.svgOverlay
      .circle(0, 0, 10)
      .attr({
        visibility: 'hidden',
        fill: '#bada55'
      })
      .addClass('spectral');
    
  },
  
  updateCursor () {
        
    if (Cursor.pointer === 'none') {
      this.svgTraceNode.attr({
        visibility: 'hidden'
      });
    } else if (Cursor.pointer === 'trace-node') {
      this.svgTraceNode.attr({
        cx: Cursor.x,
        cy: Cursor.y,
        visibility: 'visible'
      });
    }
        
  },
  
  addObject (obj) {
    
    obj.view.create(this.svgOverlay);
        
  },
  
  removeObject (obj) {
    
    obj.view.remove();
    
  },
  
  render () {
    this.renderWithTemplate(this);
    
    // Hack for now that makes sure the element
    // is attached to the dom before kicking
    // off the simulation
    window.setTimeout(this.startSimulation.bind(this), 300);
    
    this.elCanvas = this.query('#c');
    this.elOverlay = this.query('#overlay');
    
    window.setTimeout(this.initializeSvg.bind(this), 300);
    
    return this;
  }
});