module.exports = function (array, value) {
  let i, N = array.length;
  for (i=0; i < N; i++) { array[i] = value; }
};