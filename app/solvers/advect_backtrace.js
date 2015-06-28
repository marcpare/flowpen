function advect (d, d0) {
  let i, j, i0, j0, i1, j1;
  let x, y, s0, t0, s1, t1, dt0;
  
  dt0 = step / h;
    
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

module.exports = advect;