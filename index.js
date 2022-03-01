const {
  bankingService,
} = require("./apps/banking-system/banking-system-service");
const {
  moneyLaunderingService,
} = require("./apps/money-laundering-service/money-laundering");
const {
  transactionAnalysisService,
} = require("./apps/transaction-analysis-service/transaction-analysis");

bankingService(10000).catch((err) => {
  console.error("Error in banking-service: ", err);
});

moneyLaunderingService().catch((err) => {
  console.error("Error in money-laundering-service: ", err);
});

transactionAnalysisService().catch((err) => {
  console.error("Error in transaction-analysis-service: ", err);
});
