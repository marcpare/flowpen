/*

ctx: 2d context of canvas
viewport: ...
engine: simulation engine to render

*/
function Renderer (ctx, viewport, engine) {
  // get rid of black background square
  ctx.fillStyle='#ccc';
  ctx.fillRect(0, 0, engine.width, engine.height);
  let imageData = ctx.getImageData(0, 0, engine.width, engine.height);
  
  function draw () {
      let d = imageData.data,
          di, pi, ui;
        
      APP.viz(d, 
        engine.width, 
        engine.height, 
        engine.u, 
        engine.v, 
        engine.p);
    
      // Debug objects
      // for(var y = 0; y < APP.engine.height; y++) {
      //     for(var x = 0; x < APP.engine.width; x++) {
      //         pi = (y*WIDTH+x);
      //         ui = pi*2;
      //         di = pi*4;
      //
      //         if (wall(x, y)) {
      //           if (DEBUG_DRAW_WALL) {
      //             d[di+0] = 255;
      //             d[di+1] = 255;
      //             d[di+2] = 255;
      //           }
      //         } else if (object(x, y) === OBJ_INLET) {
      //           if (DEBUG_DRAW_INLET) {
      //             d[di+0] = 255;
      //             d[di+1] = 255;
      //             d[di+2] = 255;
      //           }
      //         }
      //     }
      // }
    
      viewport.bufferCtx.putImageData(imageData, 0, 0);        
    
      ctx.fillStyle = '#f9fafb';
      ctx.fillRect(0, 0, viewport.canvasWidth, viewport.canvasHeight);
      ctx.save();
      ctx.scale(viewport.scale, viewport.scale);
      ctx.drawImage(viewport.bufferCanvas, viewport.drawX, viewport.drawY);
      ctx.restore();
  }
  
  let requestAnimationFrame = (window.requestAnimationFrame       || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function( callback ){
                  window.setTimeout(callback, 1000/60);
                });

  let startTime, endTime;
  let fps = 0;

  (function animate(){
    startTime = new Date().getTime();
  
    engine.simulate();
    draw();
  
    endTime = new Date().getTime();
    fps = Math.round(1000 / (endTime-startTime));
  
    requestAnimationFrame(animate);
  })();
  
  return {
    fps: function () { return fps; }
  };
}

module.exports = Renderer;