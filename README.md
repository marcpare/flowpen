
![Splash Image](https://raw.githubusercontent.com/marcpare/flowpen/master/splash.png)

Flowpen
===

An experiment in a user interface for exploring fluid flow.

See it at: [flowpen.io](http://www.flowpen.io)

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

Link static directory and index.html

  cd dist
  ln -s ../static .
  ln -s ../index.html .

Run:

	npm start

Converting Java array indexing to I indexing:

  Find:
  \[(.{1,5}?)\]\[(.+?)\]

  Replace:
  [I($1, $2)]