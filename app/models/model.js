let engine = require('app/engines/stam.js');

class Model {
	constructor (options) {
		options = options || {};
		this.options = options;
	}
	
	createEngine () {
		let options = this.options;
		let sim = engine(options.width, 
			options.height, 
			options.step,
			options.nu,
			options.h); 
			
		// process any init commands
		options.init.forEach(cmd => {
			if (cmd.type === 'setter') {
				sim.setter(cmd.varName, cmd.i, cmd.j, cmd.value);
			}
		});
		
		return sim;
	}
}

module.exports = Model;