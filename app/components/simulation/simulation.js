let AmpersandView = require('ampersand-view');
let WindowWatcher = require('window-watcher');
let Cursor = require('app/models/cursor');
let Simulation = require('app/models/simulation');
let EditorObjects = require('app/models/editor-objects');
let Bus = require('app/lib/bus');
let UrlPersistor = require('app/lib/url-persistor');
let Solvers = require('app/lib/solvers');
let config = require('app/config');

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
    this.simulationOptions = options.simulationOptions;

    WindowWatcher.on('resize', this.recenter.bind(this));
    this.listenTo(Cursor, 'change', this.updateCursor.bind(this));
    this.listenTo(EditorObjects, 'add', this.addObject.bind(this));
    this.listenTo(EditorObjects, 'remove', this.removeObject.bind(this));
    this.listenTo(EditorObjects, 'reset', this.resetObjects.bind(this));

    this.listenTo(this, 'remove', this.cleanup);
  },

  cleanup () {
    if (this.simulation) {
      this.simulation.stop();
    }
  },

  startSimulation () {
    Simulation.initialize(Solvers[config.solver], this.query('#c'), this.simulationOptions);
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
    if (this.simulation.resize) this.simulation.resize();

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

    if (obj.createView) {
      obj.createView(this.svgOverlay.group());
    } else {
      obj.view.create(this.svgOverlay);
    }

  },

  removeObject (obj) {

    obj.view.remove();

  },

  resetObjects (objs) {

    objs.forEach(o => {

      // delete svg

      // remove from simulation

      console.log(o);
    });

  },

  render () {
    this.renderWithTemplate(this);

    // Hack for now that makes sure the element
    // is attached to the dom before kicking
    // off the simulation
    window.setTimeout(this.startSimulation.bind(this), 300);
    window.setTimeout(this.initializeSvg.bind(this), 300);
    // Major hack! Needs the two previous inits to finish first
    window.setTimeout(() => {
      UrlPersistor.start(this.simulationOptions.initialModel);
    }, 600);

    this.elCanvas = this.query('#c');
    this.elOverlay = this.query('#overlay');
    this.elScaleFrame = this.query('#scale-frame');

    return this;
  }
});