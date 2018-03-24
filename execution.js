const { performance } = require('perf_hooks');

const isDevelopment = process.env.NODE_ENV === "dev";
const getNow = performance.now;

module.exports = (functionToExecute, title = "'Функция без названия'") => {
  if (isDevelopment) {
    const startTime = getNow();
    const value = functionToExecute();
    const stopTime = getNow();
    console.log(`Функция ${title} выполнялась ${stopTime - startTime} мс.`);

    return value;
  } else {
    return functionToExecute();
  }
}