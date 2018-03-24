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

net.train(normalize(data));

const {
  comms,
  likes,
  views
} = calculateMinAndMax(data);

const sample = {
  c: utils.normalize(1, comms.min, comms.max),
  l: utils.normalize(30, likes.min, likes.max),
  v: utils.normalize(5000, views.min, views.max),
}

console.log(net.run(sample));