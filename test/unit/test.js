var test = require('tape');
var stam = require('app/engines/stam');

test('can test', function (t) {
	t.plan(1);
	t.equal(5, 5);
});

test('can require', function (t) {
	t.plan(1);
	t.ok(stam);
});

test('can swap', function (t) {
	t.plan(1);
	var a = [1, 2, 3];
	var b = [4, 5, 6];
	[a, b] = [b, a];
	t.equal(a[0], 4);
});