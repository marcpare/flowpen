/*

Url Persistor: serializes the editor state to the url.

*/

let EditorObjects = require('app/models/editor-objects');
let Model = require('ampersand-state');

let UrlPersistor = Model.extend({
  
  start () {
    this.hash = '';
    this.listenTo(EditorObjects, 'add remove change', this.handleChange);
  },
  
  handleChange () {
    
    let strings = EditorObjects.map(o => {
      return o.urlSerialize ? o.urlSerialize() : '';
    });
    let hash = strings.join('');
    
    if (hash !== this.hash) {
      this.hash = hash;
    }
    
  },
  
});

module.exports = new UrlPersistor();