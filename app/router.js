let AmpersandRouter = require('ampersand-router');
let AppScreen = require('app/components/app/app');
let app = require('ampersand-app');

let AppRouter = AmpersandRouter.extend({

  routes: {
    "": "app" 
  },

  app () {
    let view = new AppScreen();
    app.switcher.set(view);
  }

});

module.exports = AppRouter;