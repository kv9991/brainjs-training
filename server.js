require("dotenv").config();
const brain = require("brain.js");
const data = require("./data.json");
const execute = require("./execution");

const { 
  normalize,
  calculateMinAndMax
} = require("./normalization");

const utils = require("./utils");
const net = new brain.NeuralNetwork();
const options = {
  log: process.env.NODE_ENV === "dev",
}

const {
  comms,
  likes,
  views
} = calculateMinAndMax(data);

const sample = {
  c: utils.normalize(10, comms.min, comms.max),
  l: utils.normalize(40, likes.min, likes.max),
  v: utils.normalize(1000, views.min, views.max),
}

normalize(data)
  .then((normalizedData) => {
    net.train(normalizedData, options);
    return normalizedData;
  })
  .then((normalizedData) => {
    console.log(net.run(sample));
    console.log(normalizedData.map(item => item.output.d));
    Promise.resolve();
  })
  .catch((err) => {
    console.log(err);
    Promise.reject();
  })