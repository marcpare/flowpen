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
    
    console.log('serializing');
    EditorObjects.map(o => {
      if (o.urlSerialize) {
        console.log(o.urlSerialize());
      }
    });
    
  },
  
});

module.exports = new UrlPersistor();