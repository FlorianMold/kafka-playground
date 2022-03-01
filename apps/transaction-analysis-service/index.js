const {
  log,
  err,
  transactionAnalysisService,
} = require("./transaction-analysis");

const timingInterval = process.env.TIMING_INTERVAL || 10000;

transactionAnalysisService().catch(() =>
  err("Error consuming transaction-analysis!")
);

setInterval(() => {
  log("Doing something else!");
}, timingInterval);
