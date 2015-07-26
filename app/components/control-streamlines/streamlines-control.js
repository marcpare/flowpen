let View = require('ampersand-view');
let VelocityVectorField = require('app/models/editor/velocity-vector-field');
let EditorObjects = require('app/models/editor-objects');

module.exports = View.extend({
  template: require('app/components/control-streamlines/streamlines-control.jade'),
    
  events: {
    'click': 'onClick'
  },
  
  onClick () {
    EditorObjects.add(new VelocityVectorField());      
  },
  
  initialize () {
  },
});