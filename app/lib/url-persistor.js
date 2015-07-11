/*

Url Persistor: serializes the editor state to the url.

*/

let EditorObjects = require('app/models/editor-objects');
let Model = require('ampersand-state');

let UrlPersistor = Model.extend({
  
  start () {
    this.stateString = '';
    this.listenTo(EditorObjects, 'add remove change', this.handleChange);
  },
  
  handleChange () {
    
    let strings = EditorObjects.map(o => {
      return o.urlSerialize ? o.urlSerialize() : '';
    });
    let stateString = strings.join('');
    
    if (stateString !== this.stateString) {
      this.stateString = stateString;
      window.history.replaceState(null, "", "?"+this.stateString);
    }
        
  },
  
});

module.exports = new UrlPersistor();