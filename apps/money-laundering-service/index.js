const { log, err, moneyLaunderingService } = require("./money-laundering");

const timingInterval = process.env.TIMING_INTERVAL || 10000;

moneyLaunderingService().catch(() => err("Error consuming payments!"));

setInterval(() => {
  log("Doing something else!");
}, timingInterval);
