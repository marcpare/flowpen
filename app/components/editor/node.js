let View = require('ampersand-view');
 
let Node = View.extend({
  
  create (svg) {
    this.svg = svg.circle(this.model.x, this.model.y, 10);
    this.el = this.svg.node;
  },
   
});

module.exports = Node;