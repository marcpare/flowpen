/*

Url Persistor: serializes the editor state to the url.

*/

let EditorObjects = require('app/models/editor-objects');
let Model = require('ampersand-state');
let Wall = require('app/models/editor/wall');
let Inlet = require('app/models/editor/inlet');
let app = require('ampersand-app');

let UrlPersistor = Model.extend({
  
  start (initialModel) {
    
    // Prevent anything funny from happening as user
    // navigates the app...
    this.stopListening(EditorObjects);
    EditorObjects.reset();
    
    // Load any state in the url
    // Quick and dirty!
    let stateString = initialModel || "";
    this.stateString = stateString;
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
    
    this.listenTo(EditorObjects, 'add remove change reset', this.handleChange);
  },
  
  handleChange () {
    let strings = EditorObjects.map(o => {
      return o.urlSerialize ? o.urlSerialize() : '';
    });
    let stateString = strings.join('|');
    
    if (stateString !== this.stateString) {
      this.stateString = stateString;
      app.router.navigate("m/"+this.stateString, {replace: true});      
    }    
  },
  
});

module.exports = new UrlPersistor();