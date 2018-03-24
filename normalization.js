const weights = require("./weights");
const mathjs = require("mathjs");

// utils
const { 
  shouldUpdateMax,
  shouldUpdateMin,
  boolToNumber,
  normalize,
} = require("./utils");

const { 
  promisify 
} = require('util');

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
})

const addAveragesToData = (data, additionals) => {
  return {
    comms: {
      ...additionals.comms,
      average: mathjs.median(...data.map(item => item.comms)),
    },
    likes: {
      ...additionals.likes,
      average: mathjs.median(...data.map(item => item.likes)),
    },
    views: {
      ...additionals.views,
      average: mathjs.median(...data.map(item => item.views)),
    }
  }
}


const getWeightsSummary = (c, l, v) => 
  (c * weights.c + l * weights.l * + v * weights.v);

const getAverageSummary = ({ comms, likes, views }) => {
  const c = normalize(comms.average, comms.min, comms.max);
  const l = normalize(likes.average, likes.min, likes.max);
  const v = normalize(views.average, views.min, views.max);

  return getWeightsSummary(c, l, v);
}

const getNormalized = data => new Promise((resolve, reject) => resolve({
    data,
    additionals: calculateMinAndMax(data)
  }))
  .then(({ data, additionals }) => new Promise(resolve => resolve({
    data,
    additionals: addAveragesToData(data, additionals)
  }))
  .then(({ data, additionals }) => new Promise(resolve => resolve({
    data,
    additionals,
    summary: getAverageSummary(additionals),
  }))
  .then(({ data, summary, additionals }) => 
    new Promise(resolve => resolve(data.map((item) => {
      const c = normalize(item.comms, additionals.comms.min, additionals.comms.max);
      const l = normalize(item.likes, additionals.likes.min, additionals.likes.max);
      const v = normalize(item.views, additionals.views.min, additionals.views.max);

      return {
        input: {
          c, l, v
        },
        output: {
          d: getWeightsSummary(c, l, v) > summary * 1.4
        }
      }
    }))))
  .catch((err) => {
    console.log(err);
  })));


module.exports.calculateMinAndMax = calculateMinAndMax;
module.exports.normalize = getNormalized;