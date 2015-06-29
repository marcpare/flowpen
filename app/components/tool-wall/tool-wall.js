let AmpersandView = require('ampersand-view');

module.exports = AmpersandView.extend({
  template: require('app/components/tool-wall/tool-wall.jade'),
  
  initialize (options) {
    this.caption = 'Wall';
  }
});