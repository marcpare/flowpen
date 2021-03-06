// 
// Jonas Wagner's implementation of Jos Stam's Stable Fluids
// 
// http://29a.ch/sandbox/2012/fluidcanvas/
// 

// Globals
// ---------------
//
// WIDTH: number of columns of simulation
// HEIGHT: number of row of simulation
//
//
//
// Options
// ------------
//
// rows: WIDTH
// columns: HEIGHT

let Geom = require('app/lib/geom');

module.exports = function (canvas, options) {
    
  let WIDTH = options.columns || 128;
  let HEIGHT = options.rows || 128;
  let sx;
  let sy;
  let ctx = canvas.getContext('2d');
  let boundingRect = false;
  let debugBoundaries = options.debugBoundaries || false;
  
  function resize () {
    boundingRect = canvas.getBoundingClientRect();
    sx = WIDTH/canvas.clientWidth;
    sy = HEIGHT/canvas.clientHeight;
  }
  
  resize();

  var mouseX = 0, mouseY = 0;
  (function () {
    
    canvas.addEventListener('mousemove', function (e) {
      mouseX = (e.clientX - boundingRect.left)|0;
      mouseY = (e.clientY - boundingRect.top)|0;
    }); 

  })();

ctx.fillRect(0, 0, WIDTH, HEIGHT);

let N = WIDTH*HEIGHT;
let isFluid = new Array(N);
for (let i = 0; i < N; i++) isFluid[i] = true;

let inletVelocityField = new Float32Array(N*2);
for (let i = 0; i < N*2; i++) inletVelocityField[i] = 0.0;

var imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT),
    velocityField0 = new Float32Array(N*2),
    u0x = sampler(velocityField0, WIDTH, HEIGHT, 2, 0),
    u0y = sampler(velocityField0, WIDTH, HEIGHT, 2, 1),
    velocityField1 = new Float32Array(N*2),
    u1x = sampler(velocityField1, WIDTH, HEIGHT, 2, 0),
    u1y = sampler(velocityField1, WIDTH, HEIGHT, 2, 1),
    pressureField0 = new Float32Array(N),
    p0 = sampler(pressureField0, WIDTH, HEIGHT, 1, 0),
    pressureField1 = new Float32Array(N),
    p1 = sampler(pressureField1, WIDTH, HEIGHT, 1, 0),
    divergenceField = new Float32Array(N),
    div = sampler(divergenceField, WIDTH, HEIGHT, 1, 0),
        step = 4.0;

for(var i = 0; i < pressureField0.length; i++) {
    pressureField0[i] = 0;
    pressureField1[i] = pressureField0[i];
}
for(i = 0; i < velocityField0.length; i++) {
    //velocityField0[i] = (Math.random()-0.5)*10.0;
    velocityField1[i] = velocityField0[i];
}
velocityboundary(u0x, u0y);


function simulate(){
    velocityboundary(u0x, u0y);
    advect(u0x, u0y, u0x, u1x, step);
    advect(u0x, u0y, u0y, u1y, step);
    addMouseForce(u1x, u1y);
    addInletVelocity(velocityField1);
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
var lastMouseX = mouseX,
    lastMouseY = mouseY;

function addMouseForce(ux, uy){
    var x = clamp(mouseX*sx, 1, WIDTH-2),
        y = clamp(mouseY*sy, 1, HEIGHT-2),
        dx = mouseX-lastMouseX,
        dy = mouseY-lastMouseY;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    
    x = Math.floor(x);
    y = Math.floor(y);

    if (isFluid[I(x, y)]) {
      ux(x, y, ux(x, y)-dx*2);
      uy(x, y, uy(x, y)-dy*2);
    }
}

// v: velocity field
function addInletVelocity (v) {
  let i;
  for (i = 0; i < N*2; i++) {
    v[i] += inletVelocityField[i];
  }
}

function pressureboundary(p){
    for(var x = 0; x < WIDTH; x++) {
        p(x, 0, 0);
        p(x, HEIGHT-1, 0);
    }
    for(var y = 0; y < HEIGHT; y++) {
        p(0, y, 0);
        p(WIDTH-1, y, 0);
    }
}

function velocityboundary(ux, uy){
    for(var x = 0; x < WIDTH; x++) {
        ux(x, 0, 0);
        uy(x, 0, 0);

        ux(x, HEIGHT-1, 0);
        uy(x, HEIGHT-1, 0);
    }
    for(var y = 0; y < HEIGHT; y++) {
        ux(0, y, 0);
        uy(0, y, 0);

        ux(WIDTH-1, y, 0);
        uy(WIDTH-1, y, 0);
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

function I (x, y, stride=1, offset=0) {
  return (x+y*WIDTH)*stride+offset;
}

function sampler(a, width, height, stride, offset){
    var f = function(x, y, value) {
        x = (x < 0 ? 0 : (x > width-1 ? width-1 : x))|0;
        y = (y < 0 ? 0 : (y > height-1 ? height-1 : y))|0;
        if(value !== undefined){
            a[(x+y*width)*stride+offset] = value;
        }
        else {
            return a[(x+y*width)*stride+offset];
        }
    };
    f.a = a;
    return f;
}

function bilerp(sample, x, y) {
    var x0 = ~~x,
        y0 = ~~y,
        x1 = x0+1,
        y1 = y0+1,
        p00 = sample(x0, y0),
        p01 = sample(x0, y1),
        p10 = sample(x1, y0),
        p11 = sample(x1, y1);
    return lerp(lerp(p00, p10, x-x0), lerp(p01, p11, x-x0), y-y0);
}


function advect(ux, uy, src, dest, t){
    for(var y = 1; y < HEIGHT-1; y++) {
        for(var x = 1; x < WIDTH-1; x++) {
            var vx = ux(x, y)*t,
                vy = uy(x, y)*t;
                
            if (isFluid[I(x, y)]) {
              dest(x, y, bilerp(src, x+vx, y+vy));            
            }
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
        pressureboundary(p0);
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
                
            if (isFluid[I(x, y)]) {
                ux(x, y, ux(x, y)-dx);
                uy(x, y, uy(x, y)-dy);
            }
        }
    }
}

function draw(ux, uy, p){
    var d = imageData.data,
        di, pi, ui;
    for(var y = 0; y < HEIGHT; y++) {
        for(var x = 0; x < WIDTH; x++) {
            
            pi = (y*WIDTH+x);
            ui = pi*2;
            di = pi*4;
            
            if (isFluid[I(x, y)] || !debugBoundaries) {
              d[di+0] = p(x, y)*555;
              d[di+1] = ux(x, y)*128+128;
              d[di+2] = uy(x, y)*128+128;
            } else {
              d[di+0] = 0;
              d[di+1] = 0;
              d[di+2] = 0;
            }
           
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function addWall (options) {
  let x, y, dist, line, thickness, fluidState;
  thickness = options.thickness;
  fluidState = options.remove || false;
  line = new Geom.Line(options.x1, options.y1, options.x2, options.y2);
  
  for (x = 0; x < WIDTH; x++) {
    for (y = 0; y < HEIGHT; y++) {
      dist = Geom.distToSegment(Geom.p(x, y), line);      
      if (dist < thickness) {
        isFluid[I(x, y)] = fluidState;
        u0x(x, y, 0);
        u0y(x, y, 0);
        p0(x, y, 0);
        u1x(x, y, 0);
        u1y(x, y, 0);
        p1(x, y, 0);
      }
    }
  }
}

function addInlet (options) {
  let {
    segment, 
    thickness, 
    ux, 
    uy
  } = options;
  let x, y;
  for (x = 0; x < WIDTH; x++) {
    for (y = 0; y < HEIGHT; y++) {
      if (Geom.distToSegment(Geom.p(x, y), segment) < thickness) {
        inletVelocityField[I(x, y, 2, 0)] += ux;
        inletVelocityField[I(x, y, 2, 1)] += uy;
      }
    }
  } 
}

function velocityAt (x, y) {
  return [ velocityField0[I(x, y, 2, 0)], velocityField0[I(x, y, 2, 1)] ];
}

var requestAnimationFrame = (window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              });

let running = true;

(function animate(){
  
  if (!running) return;
  
    simulate();
    draw(u0x, u0y, p0);
    requestAnimationFrame(animate);
})();

return {
  resize,
  velocityAt,
  addWall,
  addInlet,
  stop () {
    running = false;
  }
};

};
