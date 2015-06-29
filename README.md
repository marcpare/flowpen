
![Splash Image](https://raw.githubusercontent.com/marcpare/flowpen/e2a34cd951906c76387c1754290db35cae8c6448/splash.png)

Flowpen
===

An experiment in a user interface for exploring fluid flow.

See it at: [flowpen.com](www.flowpen.com)

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

TODO
---

- migrate wall tool
  - get a node following the mouse cursor
  - NEXT: update cursor on start
  - NEXT: add click handler for start wall
  - NEXT: update cursor line drawing after click

- NEXT: inlet tool
- NEXT: clean up the wagner simulation code (a new lib, speed up, too?)
  - all and inlet bindings

- gut and rewrite the container.
  - globals ok for simulation
  - no zoom and pan support ; always fill the entire viewport
  - really lean on AmpersandJS; don't just reach for messy jquery
  - ES6 everything?
  - support routes?
  - save the model state in the URL? (if possible)


- do app/ directory link in npm install
