/* jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
 * http://benalman.com/
 * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL
 *
 * Ported to Browersify module 2014 Marc Paré 
 *
 */
var jq = require('jquery');
function PubSub () { this.o = jq({}); }
PubSub.prototype.subscribe = function() { this.o.on.apply(this.o, arguments); };
PubSub.prototype.unsubscribe = function() { this.o.off.apply(this.o, arguments); };
PubSub.prototype.publish = function() { this.o.trigger.apply(this.o, arguments); };
module.exports = PubSub;