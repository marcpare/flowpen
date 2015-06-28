let app = require('ampersand-app');
let Router = require('app/router');
let ViewSwitcher = require('ampersand-view-switcher');

document.qs = document.querySelector;

app.switcher = new ViewSwitcher(document.qs('#pageContainer'));

app.router = new Router();
app.router.history.start();