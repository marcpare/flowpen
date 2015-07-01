let View = require('ampersand-view');
 
let Node = View.extend({
  
  create (svg) {
    svg.circle(this.model.x, this.model.y, 10);
  }
   
});

module.exports = Node;