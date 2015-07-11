/*

Url Persistor: serializes the editor state to the url.

*/

let EditorObjects = require('app/models/editor-objects');
let Model = require('ampersand-state');

let Wall = require('app/models/editor/wall');

let UrlPersistor = Model.extend({
  
  start (options) {
    
    // Load any state in the url
    // Quick and dirty!
    if (!this.loaded) {
      let stateString = window.location.search.slice(1);
      let stateStrings = stateString.split('|');
      stateStrings.forEach(s => {
        let c = s[0];
        let rest = s.slice(1);
        
        if (c === 'W') {
          EditorObjects.add(new Wall({stateString: rest}));
        } else if (c === 'I') {
          EditorObjects.add(new Inlet({stateString: rest}));
        }
      });
      
      this.loaded = true;
    }
    
    
    
    this.stateString = '';
    this.listenTo(EditorObjects, 'add remove change', this.handleChange);
  },
  
  handleChange () {
    
    let strings = EditorObjects.map(o => {
      return o.urlSerialize ? o.urlSerialize() : '';
    });
    let stateString = strings.join('|');
    
    if (stateString !== this.stateString) {
      this.stateString = stateString;
      window.history.replaceState(null, "", "?"+this.stateString);
    }
        
  },
  
});

module.exports = new UrlPersistor();