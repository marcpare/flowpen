import macros from './macros.sjs'

// Clears values for each of the fields passed as arguments
function clearwall () {
  var i = 0, N=arguments.length, sampler, x, y;
  for (i=0; i < N; i++) {
    sampler = arguments[i];
    for (x=0; x<WIDTH; x++) {
      for (y=0; y<HEIGHT; y++) {
        if (wall(x, y)) {
          sampler(x, y, 0);
        }
      }
    }
  }
}

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
    clearwall(u0x, u0y, p0);

    // Disable for infinity boundary condition
    // velocityboundary(u0x, u0y);

    advect(u0x, u0y, u0x, u1x, step, velocityField0, velocityField0, 0, velocityField1, 0);
    advect(u0x, u0y, u0y, u1y, step, velocityField0, velocityField0, 1, velocityField0, 1);
    
    addMouseForce(u1x, u1y);
    
    runInlets(u1x, u1y);
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
    c = c < 0 ? 0 : (c > 1 ? 1 : c);
    //c = clamp(c, 0, 1);
    return a * (1 - c) + b * c;
}

function bilerp(sample, x, y, SAMPLE, SAMPLEO) {
    var x0 = ~~x,
        y0 = ~~y,
        x1 = x0+1,
        y1 = y0+1;

    var p00 = SAMPLE[I(x0, y0, SAMPLEO)],
        p01 = SAMPLE[I(x0, y1, SAMPLEO)],
        p10 = SAMPLE[I(x1, y0, SAMPLEO)],
        p11 = SAMPLE[I(x1, y1, SAMPLEO)];
    
    return LERP (LERP (p00, p10, x-x0), LERP (p01, p11, x-x0), y-y0);
}

function advect(ux, uy, src, dest, t, U, SRC, SRCO, DEST, DESTO){
    for(var y = 1; y < HEIGHT-1; y++) {
        for(var x = 1; x < WIDTH-1; x++) {
            // var vx = ux(x, y)*t,
            //     vy = uy(x, y)*t;
            //
            var vx = U[I(x, y, 0)]*t,
                vy = U[I(x, y, 1)]*t;
      
            // Very simple wall boundary condition:
            // If you advect to a wall, damp completely.
            // if (!wall(x, y)) {
              
              DEST[I(x, y, DESTO)] = bilerp(src, x+vx, y+vy, SRC, SRCO);
              
              // This is faster?              
              // dest(x, y, bilerp(src, x+vx, y+vy, SRC, SRCO));
              
            // }
        }
    }
}

function computeDivergence(ux, uy, div){
    for(var y = 1; y < HEIGHT-1; y++) {
        for(var x = 1; x < WIDTH-1; x++) {
            // compute divergence using central difference
            var x0 = ux(x-1, y),
                x1 = ux(x+1, y),
                y0 = uy(x, y-1),
                y1 = uy(x, y+1);
            div(x, y, (x1-x0 + y1-y0)*0.5);
        }
    }
}
// x = p
// b = div
function jacobi(p0, p1, b, alpha, beta, iterations){
    for(var i = 0; i < pressureField0.length; i++) {
        pressureField0[i] = 0.5;
        pressureField1[i] = pressureField0[i];
    }

    for(i = 0; i < iterations; i++) {
        for(var y = 1; y < HEIGHT-1; y++) {
            for(var x = 1; x < WIDTH-1; x++) {
                var x0 = p0(x-1, y),
                    x1 = p0(x+1, y),
                    y0 = p0(x, y-1),
                    y1 = p0(x, y+1);
                p1(x, y, (x0 + x1 + y0 + y1 + alpha * b(x, y)) * beta);
            }
        }
        var aux = p0;
        p0 = p1;
        p1 = aux;
        // pressureboundary(p0);
    }
}

function fastjacobi(p0, p1, b, alpha, beta, iterations){
    p0 = p0.a;
    p1 = p1.a;
    b = b.a;
    //for(var i = 0; i < pressureField0.length; i++) {
        //pressureField0[i] = 0.5;
        //pressureField1[i] = pressureField0[i];
    //}

    for(i = 0; i < iterations; i++) {
        for(var y = 1; y < HEIGHT-1; y++) {
            for(var x = 1; x < WIDTH-1; x++) {
                var pi = x+y*WIDTH,
                    x0 = p0[pi-1],
                    x1 = p0[pi+1],
                    y0 = p0[pi-WIDTH],
                    y1 = p0[pi+WIDTH];
                p1[pi] = (x0 + x1 + y0 + y1 + alpha * b[pi]) * beta;
            }
        }
        var aux = p0;
        p0 = p1;
        p1 = aux;
        //pressureboundary(p0);
    }
}

function subtractPressureGradient(ux, uy, p){
    for(var y = 1; y < HEIGHT-1; y++) {
        for(var x = 1; x < WIDTH-1; x++) {
            var x0 = p(x-1, y),
                x1 = p(x+1, y),
                y0 = p(x, y-1),
                y1 = p(x, y+1),
                dx = (x1-x0)/2,
                dy = (y1-y0)/2;
                ux(x, y, ux(x, y)-dx);
                uy(x, y, uy(x, y)-dy);
        }
    }
}

function max2D (sampler) {
  var x, y, ret;
  for(var y = 0; y < HEIGHT; y++) {
    for(var x = 0; x < WIDTH; x++) {              
      if (!ret) { ret = sampler(x, y); }
      ret = Math.max(ret, sampler(x, y));
    }
  }
  return ret;
}

  
module.exports = {
  simulate: simulate,
  velocityboundary: velocityboundary
}

