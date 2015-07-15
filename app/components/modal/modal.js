let View = require('ampersand-view');

module.exports = View.extend({
  
  template: require('app/components/modal/modal.jade'),
  
  openIn (container) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
 
    // Append to the container
    if (!this.rendered) {
      this.render();
    }
        
    this.el.style.display = 'none';
    container.appendChild(this.el);
    this.el.style.display = 'flex';
  }
  
});