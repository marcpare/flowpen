let AmpersandView = require('ampersand-view');
let WindowWatcher = require('window-watcher');
let Cursor = require('app/models/cursor');
let Simulation = require('app/models/simulation');
let EditorObjects = require('app/models/editor-objects');
let Bus = require('app/lib/bus');
let UrlPersistor = require('app/lib/url-persistor');
let StamWagnerSimulation = require('app/lib/stam-wagner-simulation-obstacles');

module.exports = AmpersandView.extend({
  template: require('app/components/simulation/simulation.jade'),
  
  events: {
    'mousemove #c': 'mousemove',
    'mousemove #simulation': 'mousemove',
    'mouseleave #simulation': 'mouseout',
    'mouseup #simulation': 'mouseup',
    'click #c': 'triggerClick'
  },
  
  mousemove (e) {
    // Doesn't seem to be a way to attach mousemove to just
    // the simulation or canvas bounds. Instead, attach it
    // to the containing div, making sure to not pass
    // coordinate changes when actually outside the
    // simulation area.
    if (e.toElement.id !== 'simulation') {
      Cursor.x = e.offsetX / this.scale;
      Cursor.y = e.offsetY / this.scale;
    }
  },
  
  mouseup (e) {
    Cursor.trigger('mouseup', e);
  },
  
  mouseout (e) { 
    Cursor.trigger('mouseleave', e);
  },
  
  triggerClick (e) {
    Bus.trigger('canvas-click', {
      x: e.offsetX / this.scale,
      y: e.offsetY / this.scale
    });
  },
  
  initialize (options) {
    UrlPersistor.start();
    this.simulationOptions = options.simulationOptions;
    
    WindowWatcher.on('resize', this.recenter.bind(this));
    this.listenTo(Cursor, 'change', this.updateCursor.bind(this));
    this.listenTo(EditorObjects, 'add', this.addObject.bind(this));
    this.listenTo(EditorObjects, 'remove', this.removeObject.bind(this));
  },
  
  startSimulation () {
    Simulation.initialize(StamWagnerSimulation, this.query('#c'), this.simulationOptions);
    this.simulation = Simulation;
    this.recenter();
  },
  
  recenter () {
    
    // Update the canvas position in the DOM
    let W = this.el.offsetWidth;
    let H = this.el.offsetHeight;
    let a = W / this.simulationOptions.columns;
    let b = H / this.simulationOptions.rows;
    let c = Math.min(a, b);
    
    this.scale = c;
    
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
      
    // Update the scale frame so that simulation and overlay
    // coordinate systems match
    this.elScaleFrame.setAttribute('transform', `scale(${c})`);
       
    // Update the simulation globals
    this.simulation.resize();
  
  },
  
  initializeSvg () {
        
    // Initialize svg overlay and elements
    this.svgOverlay = Snap('#scale-frame');
    
    this.svgTraceNode = this.svgOverlay
      .circle(0, 0, 2)
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
    this.elScaleFrame = this.query('#scale-frame');
    
    window.setTimeout(this.initializeSvg.bind(this), 300);
    
    return this;
  }
});