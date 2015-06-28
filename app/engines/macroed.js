// Sets fixed velocity at each inlet point at each time step
function runInlets (ux, uy) {
  var x, y, o;
  for (x=0; x<WIDTH; x++) {
    for (y=0; y<HEIGHT; y++) {
      o = object(x, y);
      if (o && o.type === OBJ_INLET) {
        ux(x, y, o.ux);
        uy(x, y, o.uy);
      }
    }
  }
}

function simulate () {

    // Disable for infinity boundary condition
    // velocityboundary(u0x, u0y);

    advect(u0x, u0y, u0x, u1x, step, velocityField0, velocityField0, 0, velocityField1, 0);
    advect(u0x, u0y, u0y, u1y, step, velocityField0, velocityField0, 1, velocityField0, 1);
    
    addMouseForce(u1x, u1y);
    
    // runInlets(u1x, u1y);
    computeDivergence(u1x, u1y, div);
    // needs an even number of iterations
    fastjacobi(p0, p1, div, -1, 0.25, 16);
    //advect(u1x, u1y, p0, p1);
    //velocityField0 = diffuse(velocityField1, pressureField);
    //pressureField = recomputePressure(velocityField0);
    subtractPressureGradient(u1x, u1y, p0);
    var aux = p0;
    p0 = p1;
    p1 = aux;

    aux = u0x;
    u0x = u1x;
    u1x = aux;

    aux = u0y;
    u0y = u1y;
    u1y = aux;
}

function addMouseForce(ux, uy){
    // var x = clamp(mouseX*0.1, 1, WIDTH-2),
    //     y = clamp(mouseY*0.1, 1, HEIGHT-2),
    //     dx = mouseX-lastMouseX,
    //     dy = mouseY-lastMouseY;
    // lastMouseX = mouseX;
    // lastMouseY = mouseY;
    // ux(x, y, ux(x, y)-dx*2);
    // uy(x, y, uy(x, y)-dy*2);
}

function pressureboundary(p){
    for(var x = 0; x < WIDTH; x++) {
        p(x, 0, p(x, 1));
        p(x, HEIGHT-1, p(x, HEIGHT-2));
      }
    for(var y = 0; y < HEIGHT; y++) {
        p(0, y, p(1, y));
        p(WIDTH-1, y, p(WIDTH-2, y));
    }
}

function velocityboundary(ux, uy){
    for(var x = 0; x < WIDTH; x++) {
        ux(x, 0, -ux(x, 1));
        uy(x, 0, -uy(x, 1));

        ux(x, HEIGHT-1, -ux(x, HEIGHT-2));
        uy(x, HEIGHT-1, -uy(x, HEIGHT-2));
    }
    for(var y = 0; y < HEIGHT; y++) {
        ux(0, y, -ux(1, y));
        uy(0, y, -uy(1, y));

        ux(WIDTH-1, y, -ux(WIDTH-2, y));
        uy(WIDTH-1, y, -uy(WIDTH-2, y));
    }
}

function clamp(a, min, max){
    return Math.max(Math.min(a, max), min);
}

function lerp(a, b, c){
    c = clamp(c, 0, 1);
    return a * (1 - c) + b * c;
}

function bound (x, MAX) {
	return (x < 0 ? 0 : (x > MAX-1 ? MAX-1 : x))|0;
}

function boundx (x) {
	return bound(x, WIDTH);
}

function boundy (y) {
	return bound(y, HEIGHT);
}

function index (x, y, o) {
	return (x+y*WIDTH)*2+o;
}

function bilerp(sample, x, y, SAMPLE, SAMPLEO) {
    var x0 = ~~x,
        y0 = ~~y,
        x1 = x0+1,
        y1 = y0+1;
				
		x0 = boundx(x0);
		y0 = boundy(y0);
		x1 = boundx(x1);
		y1 = boundy(y1);
		
		var pi00 = index(x0, y0, SAMPLEO),
				pi01 = index(x0, y1, SAMPLEO),
				pi10 = index(x1, y0, SAMPLEO),
				pi11 = index(x1, y1, SAMPLEO);
		
    var p00 = SAMPLE[pi00],
        p01 = SAMPLE[pi01],
        p10 = SAMPLE[pi10],
        p11 = SAMPLE[pi11];
    
    return lerp (lerp (p00, p10, x-x0), lerp (p01, p11, x-x0), y-y0);
}

function advect(ux, uy, src, dest, t, U, SRC, SRCO, DEST, DESTO){
		var x, y, vx, vy, di;
    for(y = 1; y < HEIGHT-1; y++) {
        for(x = 1; x < WIDTH-1; x++) {
						di = (x+y*WIDTH)*2;
            vx = U[di]*t;
            vy = U[di+1]*t;
						DEST[di+DESTO] = bilerp(src, x+vx, y+vy, SRC, SRCO);
        }
    }
}

function computeDivergence(ux, uy, div){
		var x, y, x0, x1, y0, y1;
		ux = ux.a;
		uy = uy.a;
		
    for(y = 1; y < HEIGHT-1; y++) {
        for(x = 1; x < WIDTH-1; x++) {
            // compute divergence using central difference					
						x0 = ux[index(x-1, y, 0)];
						x1 = ux[index(x+1, y, 0)];
						y0 = uy[index(x, y-1, 1)];
						y1 = uy[index(x, y+1, 1)];

            div(x, y, (x1-x0 + y1-y0)*0.5);
        }
    }
}

function fastjacobi(p0, p1, b, alpha, beta, iterations){
		
		var x, y, pi, x0, x1, y0, y1, aux, i;
		
	  // Pull raw array from sampler object
    p0 = p0.a;
    p1 = p1.a;
    b = b.a;

    for(i = 0; i < iterations; i++) {
        for(y = 1; y < HEIGHT-1; y++) {
            for(x = 1; x < WIDTH-1; x++) {
							pi = x+y*WIDTH;
							x0 = p0[pi-1];
							x1 = p0[pi+1];
							y0 = p0[pi-WIDTH];
              y1 = p0[pi+WIDTH];
              p1[pi] = (x0 + x1 + y0 + y1 + alpha * b[pi]) * beta;
            }
        }
        aux = p0;
        p0 = p1;
        p1 = aux;
        //pressureboundary(p0);
    }
}

function subtractPressureGradient(ux, uy, p){
  	var pi, x0, x1, y0, y1, dx, dy, x, y, ui;
		
		// Pull raw array from sampler object
		p = p.a;
		ux = ux.a;
		uy = uy.a;
				
		for(y = 1; y < HEIGHT-1; y++) {
        for(x = 1; x < WIDTH-1; x++) {
						pi = x+y*WIDTH;
						x0 = p[pi-1];
						x1 = p[pi+1];
						y0 = p[pi-WIDTH];
						y1 = p[pi+WIDTH];
						dx = (x1-x0)/2;
	          dy = (y1-y0)/2;
						
						ui = (x+y*WIDTH)*2;

						ux[ui] -= dx;
						uy[ui+1] -= dy;								
        }
    }
}
  
module.exports = {
  simulate: simulate,
  velocityboundary: velocityboundary
};

