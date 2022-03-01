const log =
  (applicationName, fn = console.log) =>
  (...args) => {
    fn(`${applicationName}:`, ...args);
  };

module.exports = log;
