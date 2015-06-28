/*

ctx: 2d context of canvas

*/

class SimpleRenderer {
  
  constructor (ctx, viz, canvasWidth, canvasHeight) {
    
    // buffer canvas so that we can do scaling
    let bufferCanvas = document.createElement('canvas');
    bufferCanvas.setAttribute('width', width);
    bufferCanvas.setAttribute('height', height);
    let bufferCtx = bufferCanvas.getContext("2d");
    this.bufferCtx = bufferCtx;
    this.bufferCanvas = bufferCanvas;
    
    // get rid of black background square
    ctx.fillStyle='#ccc';
    ctx.fillRect(0, 0, width, height);
    this.imageData = ctx.getImageData(0, 0, width, height);
    
    this.ctx = ctx;
    this.viz = viz;
    
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.scaleW = canvasWidth / width;
    this.scaleH = canvasHeight / height;
  }
  
  draw () {
    let d = this.imageData.data;
    let di, pi, ui;
    
    this.viz(d, 
             width, 
             height, 
             u, 
             v, 
             phi);

    this.bufferCtx.putImageData(this.imageData, 0, 0);

    this.ctx.fillStyle = '#f9fafb';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.save();
    this.ctx.scale(this.scaleW, this.scaleH);
    this.ctx.drawImage(this.bufferCanvas, 0, 0);
    this.ctx.restore();
  }
}

module.exports = SimpleRenderer;