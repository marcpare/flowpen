let AmpersandRouter = require('ampersand-router');
let AppScreen = require('app/components/app/app');
let GalleryScreen = require('app/components/gallery/gallery');
let app = require('ampersand-app');

let AppRouter = AmpersandRouter.extend({

  routes: {
    "": "app",
    "m/:model": "app",
    "gallery": "gallery",
  },

  app (initialModel) {
    let view = new AppScreen({
      initialModel
    });
    app.switcher.set(view);
  },
  
  gallery () {
    let view = new GalleryScreen();
    app.switcher.set(view);
  },

});

module.exports = AppRouter;