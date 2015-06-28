
/*

width: simulation width
height: simulation height
step: time step [s]
nu: kinematic viscosity of the fluid [m^2/s]
h: length of a cell side [m]

*/
let engine = function (width, height, step, nu, h) {
	let exports;
	let N 		 = width*height;
	let u      = new Float32Array(N); // x velocity
	let u_prev = new Float32Array(N);
	let v      = new Float32Array(N); // y velocity
	let v_prev = new Float32Array(N);
	let p      = new Float32Array(N); // pressure
	let div    = new Float32Array(N); // divergence
	let _h     = 1.0 / h; // inverse of cell side
	let GS		 = 20;
	
	function fill (arr, val) {
		for (let i=0; i < arr.length; i++) arr[i] = val;
	}
	
	fill(u, 0.0);
	fill(u_prev, 0.0);
	fill(v, 0.0);
	fill(v_prev, 0.0);
	fill(p, 0.0);
	fill(div, 0.0);
	
	function simulateDiffusion () {
		[u_prev, u] = [u, u_prev];
		[v_prev, v] = [v, v_prev];
		diffuse(u, u_prev);
		diffuse(v, v_prev);
	}
	
	function simulate () {
		[u_prev, u] = [u, u_prev];
		[v_prev, v] = [v, v_prev];
		diffuse(u, u_prev);
		diffuse(v, v_prev);
		advect(u, u_prev, u_prev, v_prev);
		advect(v, v_prev, u_prev, v_prev);
	}
	
	function I (x, y) {
		return x+y*width;
	}
	
	/*
	Diffuse to x from x0
	
	Finds the density which when diffused backward in time yield the 
	density we started with.
	*/
	function diffuse (x, x0) {
		let i, j, k, a, w0, w1, w2, w3;
		a = step*nu*_h*_h;
		for (k=0; k < GS; k++) {
			for (i=0; i < width; i++) {
				for (j=0; j< height; j++) {
					w0 = i>0 ? 			  x[I(i-1, j)] : 0;
					w1 = i<width-1 ?  x[I(i+1, j)] : 0;
					w2 = j>0 ? 			  x[I(i, j-1)] : 0;
					w3 = j<height-1 ? x[I(i, j+1)] : 0;
					x[I(i,j)] = (x0[I(i,j)] + a * (w0 + w1 + w2 + w3)) / (1+4*a);
				}
			}
		}
	}
	
	function lerp(a, b, c){
	    c = c < 0 ? 0 : (c > 1 ? 1 : c);
	    return a * (1 - c) + b * c;
	}

	function bilerp(d, x, y) {
	    var x0 = ~~x,
	        y0 = ~~y,
	        x1 = x0+1,
	        y1 = y0+1,
					p00 = d[I(x0, y0)],
					p01 = d[I(x0, y1)],
					p10 = d[I(x1, y0)],
	        p11 = d[I(x1, y1)];
	    return lerp(lerp(p00, p10, x-x0), lerp(p01, p11, x-x0), y-y0);
	}
	
	function advect2 (d, d0, u, v) {
		let x, y, vx, vy;
		for (x=1; x < width-1; x++) {
			for (y=1; y < height-1; y++) {
				vx = u[I(x, y)];
				vy = v[I(x, y)];
				d[I(x, y)] = bilerp(d0, x+vx, y+vy);
			}
		}
	}
	
	function advect (d, d0, u, v) {
		let i, j, i0, j0, i1, j1;
		let x, y, s0, t0, s1, t1, dt0;
		
		dt0 = step*_h; // [s/m]
		for (i = 1; i < width-1; i++) {
			for (j = 1; j < height-1; j++) {
				x = i - dt0*u[I(i,j)];
				if (x < 0.5) x = 0.5;
				if (x > width+0.5) x = width + 0.5;
				i0 = Math.floor(x);
				i1 = i0+1;
				
				y = j - dt0*v[I(i,j)];
				if (y < 0.5) y = 0.5;
				if (y > height+0.5) y = height + 0.5;
				j0 = Math.floor(y);
				j1 = j0+1;
				
				s1 = x-i0;
				s0 = 1-s1;
				t1 = y-j0;
				t0 = 1-t1;
				
				d[I(i,j)] = s0*(t0*d0[I(i0, j0)]+t1*d0[I(i0,j1)]) + 
										s1*(t0*d0[I(i1, j0)]+t1*d0[I(i1,j1)]);
			}
		}
	}
	
	function setter (varName, i, j, value) {
		if (varName === 'u') {
			u[I(i, j)] = value;
			u_prev[I(i, j)] = value;
		} else {
			console.log('Missing varName');
		}
	}
	
	function getter (varName, i, j) {
		if (varName === 'u') {
			return u[I(i, j)];
		} else {
			console.log('Missing varName');
		}
	}
		
	exports = {
		u,
		u_prev,
		v,
		v_prev,
		p,
		setter,
		getter,
		simulate,
		width,
		height
	};
	return exports;
};

module.exports = engine;