let AmpersandRouter = require('ampersand-router');
let AppScreen = require('app/screens/app.js');
let TestbedScreen = require('app/screens/testbed.js');
let app = require('ampersand-app');
let AppRouter = AmpersandRouter.extend({

  routes: {
    "help": "help",    
    "testbed/:id": "testbed",
    "testbed": "testbed", 
    "": "app" 
  },

  help () {
    
  },

  testbed (id) {
    let view;
    if (id) {
      view = new TestbedScreen({id:id});
    } else {
      view = new TestbedScreen();
    }
    app.switcher.set(view);
  },
  
  app () {
    let view = new AppScreen();
    app.switcher.set(view);
  }

});

module.exports = AppRouter;