let AmpersandView = require('ampersand-view');
let app = require('ampersand-app');

module.exports = AmpersandView.extend({
  template: require('app/components/gallery/gallery.jade'),
  
  events: {
    'click .gallery-item': 'go'
  },
  
  go (e) {
    app.router.navigate("/m/W1,1,10,10", {trigger: true});
  },
  
  initialize () {
    this.items = [
      {
        id: "placeholder",
        title: "Entrainment",
        description: "Demonstrates entrainment, the not-so-intuituve phenomenon when flow passes an opening."
      }
    ];
  },
  
});