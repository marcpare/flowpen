
![Splash Image](https://raw.githubusercontent.com/marcpare/flowpen/e2a34cd951906c76387c1754290db35cae8c6448/splash.png)

Flowpen
===

An experiment in a user interface for exploring fluid flow.

See it at: [flowpen.io](www.flowpen.io)

The solver is a fork of [Jonas Wagner's implementation](http://29a.ch/sandbox/2012/fluidcanvas/) of Jos Stam's Stable Fluids. 

The editor is built with AmpersandJS.

Develop
---

Install global tools:

	sudo npm install -g browserify gulp babel

Install dependencies:

	npm install

Link app in node_modules

	cd node_modules
	ln -s ../app .

Run:

	npm start