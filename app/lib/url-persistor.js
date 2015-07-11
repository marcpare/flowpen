/*

Url Persistor: serializes the editor state to the url.

*/

let EditorObjects = require('app/models/editor-objects');
let Model = require('ampersand-state');

let UrlPersistor = Model.extend({
  
  start () {
    this.listenTo(EditorObjects, 'add remove', this.handleChange);
  },
  
  handleChange () {
    console.log('going to update the url');
  },
  
});

module.exports = new UrlPersistor();