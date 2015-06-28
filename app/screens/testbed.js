let app = require('ampersand-app');
let AmpersandView = require('ampersand-view');
let State = require('ampersand-state');
let viz = require('app/visualizations/cool');
let Renderer = require('app/simple-renderer');
let Flowpens = require('app/collections/flowpens');

let TestbedsModel = State.extend({
  props: {
    error: {
      type: 'boolean',
      default: false
    },
    errorMessage: {
      type: 'string'
    },
    id: {
      type: 'string'
    },
    width: {
      type: 'int'
    },
    height: {
      type: 'int'
    },
    modelView: {
      type: 'string',
      values: ['table', 'visual'],
      default: 'visual'
    },
    src: {
      type: 'string'
    },
    frame: {
      type: 'number'
    }
  }
});

var ModelsListItemView = AmpersandView.extend({
  template: require('app/templates/model-list-item.jade'),
  
  events: {
    'click': 'loadPen'
  },
  
  bindings: {
    'active': {
      type: 'booleanClass',
      name: 'tb-item-active'
    }
  },
  
  initialize (options) {
    this.active = this.model.id === options.active;
  },
  
  loadPen () {
    if (this.active) { return; }
    
    app.router.navigate('testbed/'+this.model.id, {trigger: true});
  }
});

var TableView = AmpersandView.extend({
  template: require('app/templates/table-view.jade'),
  
  render () {
    this.renderWithTemplate({
      model: this.model,
      u,
      v,
      width,
      height,
      I
    });
  }
});

module.exports = AmpersandView.extend({
  template: require('app/templates/testbed.jade'),
  
  bindings: {
    'model.modelView': [
      {
        type: 'switchClass',
        name: 'tb-control-active',
        cases: {
          'visual': '[data-hook=visual-view]',
          'table': '[data-hook=table-view]'
        }
      },
      {
        type: 'switch',
        cases: {
          'visual': '[data-hook=canvas]',
          'table': '[data-hook=table]'
        }
      }
    ],
    'model.frame': '[data-hook=frame]'
  },
  
  events: {
    'click [data-hook=visual-view]': 'toggleVisualView',
    'click [data-hook=table-view]': 'toggleTableView',
    'click [data-hook=control-step]': 'step',
    'click [data-hook=control-play]': 'play',
    'click [data-hook=control-reset]': 'reset'
  },
  
  toggleVisualView () {
    this.model.modelView = 'visual';
  },
  
  toggleTableView () {
    this.model.modelView = 'table';
  },
  
  initialize (options) {
    this.model = new TestbedsModel();
    this.testbed = Flowpens.get(options.id);
    if (!this.testbed) {
      this.model.error = true;
      this.model.errorMessage = 'Unknown testbed model';
    } else {
      this.model.id = options.id;
      this.testbed.init();
      this.model.width = this.testbed.options.width;
      this.model.height = this.testbed.options.height;
      this.model.frame = 1;
    }
    
    this.model.src = `
for (var i = 10; i < 50; i++) {
  ...
}`;
    
  },
  
  step () {
    this.testbed.simulate();
    this.renderer.draw();
    this.tableView.render();
    this.model.frame = this.model.frame + 1;
  },
  
  play () {
    let self = this;
    self.playing = true;
    let requestAnimationFrame = (
      window.requestAnimationFrame || 
      window.webkitRequestAnimationFrame || 
      window.mozRequestAnimationFrame    || 
      window.oRequestAnimationFrame      || 
      window.msRequestAnimationFrame     || 
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      });
    
    (function animate(){
      if (self.playing) { 
        self.step();
        requestAnimationFrame(animate); 
      }
    })();
    
    // window.setInterval(this.step.bind(this), 100);
  },
  
  remove () {
    AmpersandView.prototype.remove.call(this);
    this.playing = false;
  },
  
  reset () {
    this.testbed.init();
    this.renderer.draw();
    this.tableView.render();
    this.model.frame = 1;
    this.playing = false;
  },
  
  render () {
    this.renderWithTemplate(this);
    
    if (!this.renderer) {
      let canvas = this.queryByHook('test-canvas');
      let ctx = canvas.getContext("2d");
      this.renderer = new Renderer(ctx, 
        viz, 
        this.testbed.options.width, 
        this.testbed.options.height);
      this.renderer.draw();
    }
    
    this.tableView = new TableView({
      model: this.model
    });
    this.renderSubview(this.tableView, '[data-hook=table]');
    
    this.renderCollection(Flowpens, 
      ModelsListItemView, 
      '[data-hook=models-list]',
      {viewOptions: {active: this.testbed.id}});
    
  }
});


