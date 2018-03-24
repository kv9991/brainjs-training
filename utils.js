const isEmpty = value => value === null;

module.exports = {
  shouldUpdateMax: (prev, current) => isEmpty(prev) || prev < current,
  shouldUpdateMin: (prev, current) => isEmpty(prev) || prev > current,
  boolToNumber: (bool) => bool ? 1 : 0,
  normalize: (x, min, max) => (x - min)/(max-min),
}