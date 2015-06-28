function copy (src, dst) {
  let i;
  for (i = 0; i < src.length; i++) { dst[i] = src[i]; }
}
module.exports = copy;