function lerp (a, b, c){
    c = c < 0 ? 0 : (c > 1 ? 1 : c);
    return a * (1 - c) + b * c;
}

module.exports = function (sample, x, y, I) {
  let x0 = ~~x,
    y0 = ~~y,
    x1 = x0+1,
    y1 = y0+1,
    p00 = sample[I(x0, y0)],
    p01 = sample[I(x0, y1)],
    p10 = sample[I(x1, y0)],
    p11 = sample[I(x1, y1)];
    return lerp(lerp(p00, p10, x-x0), lerp(p01, p11, x-x0), y-y0);
};