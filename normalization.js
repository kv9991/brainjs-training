const weights = require("./weights");

// utils
const { 
  shouldUpdateMax,
  shouldUpdateMin,
  boolToNumber,
  normalize,
} = require("./utils");

const calculateMinAndMax = arr => arr.reduce((prev, curr) => {
  const {
    comms,
    likes,
    views
  } = prev;

  const nextValue = {
    comms: {},
    views: {},
    likes: {},
  }

  if (shouldUpdateMax(comms.max, curr.comms)) {
    nextValue.comms.max = curr.comms;
  }

  if (shouldUpdateMin(comms.min, curr.comms)) {
    nextValue.comms.min = curr.comms;
  } 

  if (shouldUpdateMax(likes.max, curr.likes)) {
    nextValue.likes.max = curr.likes;
  }

  if (shouldUpdateMin(likes.min, curr.likes)) {
    nextValue.likes.min = curr.likes;
  }

  if (shouldUpdateMax(views.max, curr.views)) {
    nextValue.views.max = curr.views;
  }

  if (shouldUpdateMin(views.min, curr.views)) {
    nextValue.views.min = curr.views;
  }

  return {
    comms: {
      ...prev.comms,
      ...nextValue.comms,
    },
    likes: {
      ...prev.likes,
      ...nextValue.likes,
    },
    views: {
      ...prev.views,
      ...nextValue.views,
    },
  }

}, { 
  comms: {
    min: null,
    max: null,
  },
  likes: {
    min: null,
    max: null,
  }, 
  views: {
    min: null,
    max: null,
  }
});


const calculateDisplayRatio = (c, l, v) => (c * weights.c + l * weights.l * + v * weights.v);

const getNormalized = ({ comms, views, likes }, data) => data.map((item) => {
  const c = normalize(item.comms, comms.min, comms.max);
  const l = normalize(item.likes, likes.min, likes.max);
  const v = normalize(item.views, views.min, views.max);

  return {
    input: {
      c, l, v
    },
    output: {
      shouldDisplay: item.out
    }
  }
});

module.exports.calculateMinAndMax = calculateMinAndMax;
module.exports.normalize = data => getNormalized(calculateMinAndMax(data), data);