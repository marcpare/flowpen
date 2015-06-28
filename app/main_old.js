var PubSub           = require('app/pubsub.js'),
    BUS              = new PubSub(),
    Dragging         = require('app/dragging.js'),
    _                = require('underscore'),
    $                = require('jquery'),
    SnacksView       = require('app/chrome/snacksView.js'),
    FramerateView    = require('app/chrome/framerate/framerateView.js'),
    geom             = require('app/geom.js'),
    Line             = geom.Line,
    Point            = geom.Point,
    Arrow            = require('app/objects/arrow.js'),
    h                = {},
    drag,
    OBJ_INLET        = 2,
    $window          = $(window),
    $simContainer    = $('#sim-container'),
    canvas           = document.getElementById('c'),
    $canvas          = $('#c'),
    $overlay         = $('#overlay'),
    overlaySnap      = Snap('#overlay'),
    $overlayg        = $('#overlay-g'),
    overlaygSnap     = Snap('#overlay-g'),
    $leftbar         = $('[role=left-bar]'),
    traceNode,
    traceLine,
    mouseX           = 0,
    mouseY           = 0,
    lastMouseX       = 0,
    lastMouseY       = 0,
    mouseAt,
    DEBUG_DRAW_WALL  = false,
    DEBUG_DRAW_INLET = true,
    visualizations   = require('app/visualizations'),
    chrome           = require('app/chrome.js'),
    framerateCollection = require('app/collections/framerate_collection.js'),
    Renderer         = require('app/renderer.js'),
    Models           = require('app/collections/models.js'),
    Router           = require('app/router.js'),
    ViewSwitcher     = require('ampersand-view-switcher'),
    app              = require('ampersand-app');


app.switcher = new ViewSwitcher(document.querySelector('#pageContainer'));

app.router = new Router();
app.router.history.start();


// Set globals
window.JST = {};
window.APP = {};
window.BUS = BUS;
// window.h = h;
window.OBJ_INLET = OBJ_INLET;
window.mouseX = mouseX;
window.mouseY = mouseY;
window.lastMouseX = lastMouseX;
window.lastMouseY = lastMouseY;
window.drag = drag;

APP.overlaygSnap = overlaygSnap;

var hud = require('app/hud.js');
_.extend(hud, overlaygSnap);

APP.mouseAt = mouseAt;

// Load the model
let model = Models.byId(2);
APP.engine = model.createEngine();


APP.$canvas = $canvas;
APP.toolState = 'none';
APP.cursor = false;
APP.objects = [];
APP.visualization = 'Combined';
APP.viz = visualizations.cool;
// JST.visualizations = _.template($('#template-visualizations').html(), {variable:'data'});
JST.visualizations = () => {};

h.toggle = function (condition, ifTrue, otherwise) { return condition ? ifTrue : otherwise; };

APP.traceLine = overlaygSnap
  .line(0, 0, 0, 0)
  .attr({
    visibility: 'hidden',
    stroke: 'black'
  })
  .addClass('spectral');

APP.traceNode = overlaygSnap
  .circle(0, 0, 1)
  .attr({
    visibility: 'hidden',
    fill: '#bada55'
  })
  .addClass('spectral');

var snacksView = new SnacksView({
  el: document.getElementById('snack-container')
});

snacksView.render();

APP.snacksView = snacksView;

var SensorPressureToolView = require('app/chrome/sensors/sensorPressureView.js');
var view = new SensorPressureToolView({
  el: document.getElementById('button-sensor-pressure')
});
view.render();

var SensorVelocityToolView = require('app/chrome/sensors/sensorVelocityView.js');
var view = new SensorVelocityToolView({
  el: document.getElementById('button-sensor-velocity')
});
view.render();

var framerateCollection = require('app/collections/framerate_collection.js');
APP.framerateView = new FramerateView({
  el: document.getElementById('framerate-container'),
  collection: framerateCollection,
  width: 80, 
  height: 20,
  yaxis: [0, 50],
  points: 10
});
APP.framerateView.render();

APP.state = require('app/states/state-machine.js');

chrome();
  
  
/*

Canvas Viewport
---------------

Simulation is rendered to a buffer canvas element.
Scaling is applied to main canvas element since you can't `scale` `putImageData`/

(drawX, drawY) [Simulation Coordinates]

*/
var overlay = {
  scale: 1,
  translateX: 0,
  translateY: 0,
  zoom (scale) {
    this.scale = scale;
    this.applyTransform();
  },
  panTo (x, y) {
    this.translateX = x;
    this.translateY = y;
    this.applyTransform();
  },
  panBy (dx, dy) {
    this.translateX += dx;
    this.translateY += dy;
    this.applyTransform();
  },
  applyTransform () {
    $overlayg.attr('transform', 
      `scale (${this.scale}) 
       translate(${this.translateX} ${this.translateY})`);
  }
};
APP.viewport = {
  init: function (canvas) {
    this.canvas = canvas;
    this.setCanvasBounds(windowWidth(), windowHeight());
    this.ctx = canvas.getContext('2d');          
    this.bufferCanvas = $('<canvas>')
        .attr("width", APP.engine.width)
        .attr("height", APP.engine.height)[0];
    this.bufferCtx = this.bufferCanvas.getContext("2d");
    this.drawX = 0;
    this.drawY = 0;    
    this.scale = 1.0;
    this.zoom(1);
    this.scaleToViewport();
  },
  
  /*
  Bounds of the containing <canvas> element.
  */
  setCanvasBounds: function (width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    $overlay.width(width-2);
    $overlay.height(height-2);
  },
  
  canvasWidthScaled: function () {
    return this.canvasWidth * this.scale;
  },
  
  canvasHeightScaled: function () {
    return this.canvasHeight * this.scale;
  },
  
  /*
  (x, y) in simulation x, y
  */
  centerOn: function (x, y) {
    this.panTo(windowWidth()/2/this.scale-x,
               windowHeight()/2/this.scale-y);
  },
  
  /*
  (x, y) in simulation x, y
  */
  panTo: function (x, y) {
    this.drawX = x;
    this.drawY = y;
    overlay.panTo(x, y);
  },
  
  /*
  (x, y) in pixels
  */
  panToPixel: function (x, y) {
    this.drawX = x/this.scale;
    this.drawY = y/this.scale;
  },
  
  /*
  (dx, dy) in pixels
  */
  panByPixels: function (dx, dy) {
    this.panBy(dx/this.scale, dy/this.scale);
  },
  
  /*
  (dx, dy) in simulation x, y
  */
  panBy: function (dx, dy) {
    this.drawX += dx;
    this.drawY += dy;
    overlay.panBy(dx, dy);
  },
  
  /*
  Applies scale to current scale level.
  */
  zoom: function (s, options) {
    var cpBefore, cpAfter, vpx, vpy;
    options = options || {};
    
    if (options.recenter) {
      vpx = windowWidth()/2;
      vpy = windowHeight()/2;
      cpBefore = this.at(vpx, vpy);
    }
    
    this.scale = s;
    overlay.zoom(s);
    $overlayg.attr('transform', 'scale('+s+')');
    
    if (options.recenter) {
      cpAfter = this.at(vpx, vpy);
      this.panBy((cpAfter[0]-cpBefore[0]), 
                 (cpAfter[1]-cpBefore[1]));
    }
  },
  
  /*
  Returns simulation coordinate for a viewport coordinate
  */
  at: function (viewportX, viewportY) {
    return [viewportX/this.scale-this.drawX,
            viewportY/this.scale-this.drawY];
  },
  
  zoomOut: function () {
    this.zoom(this.scale*0.9, {recenter:true});
  },
  
  zoomIn: function () {
    this.zoom(this.scale*1.1, {recenter:true});
  },
  
  /*
  Centers and zooms out to show the entire simulation grid
  */
  scaleToViewport: function () {
    var scale, px, py, WW, WH;
    WW = windowWidth();
    WH = windowHeight();
    scale = Math.min(WW/APP.engine.width,
                     WH/APP.engine.height);
    this.zoom(scale, scale);
    this.centerOn(APP.engine.width/2, APP.engine.height/2);
  }
};
/* END Canvas Viewport */
  
APP.viewport.init(canvas);
                
(function () {
  var rect = canvas.getBoundingClientRect(),
      left = rect.left,
      top = rect.top,
      at;
  canvas.addEventListener('mousemove', e => {
      mouseX = (e.clientX - left)|0;
      mouseY = (e.clientY - top)|0;
      at = APP.viewport.at(mouseX, mouseY);
      APP.mouseAt = geom.p(at[0], at[1]);
      APP.traceLine.attr({
        x2:at[0],
        y2:at[1]
      });
      APP.traceNode.attr({
        cx:at[0],
        cy:at[1]
      });
  });
})();
  
window.addEventListener('keydown', function (e) {
  var c = String.fromCharCode(e.keyCode);
  if (c === 'Z') { APP.viewport.zoomIn(); }
  if (c === 'X') { APP.viewport.zoomOut(); }
});

function windowWidth () { return $simContainer.width(); }
function windowHeight () { return $simContainer.height(); }

APP.windowWidth = windowWidth;
APP.windowHeight = windowHeight;

APP.mouseAtPoint = function () {
  var coords = APP.viewport.at(mouseX, mouseY);
  return new Point(coords[0], coords[1]);
};

// Kick off the rendering
APP.renderer = Renderer(canvas.getContext('2d'), APP.viewport, APP.engine);

window.setInterval(function () {
  framerateCollection.add({value: APP.renderer.fps()});
}, 1000);

