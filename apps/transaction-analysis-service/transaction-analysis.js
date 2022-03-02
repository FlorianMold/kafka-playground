const { Kafka } = require("kafkajs");
const { brokers, topics } = require("./core/kafka-config");
const logger = require("./core/logger");

const clientId = "transaction-analysis-service";
const log = logger(clientId);
const err = logger(clientId, console.error);
const topic = topics.laundryCheckTopic;

const kafka = new Kafka({ clientId, brokers });
const consumer = kafka.consumer({ groupId: clientId });
const allowedValues = ["true", "false"];
/**
 * Statistic, which prints the successful payments and the unsuccessful payments.
 * @type {{success: number, error: number}}
 */
const statistic = {
  error: 0,
  success: 0,
  total: 0,
};

/**
 * Consumes messages from the laundry-check topic and prints the statistic after every received message.
 * @return {Promise<void>}
 */
const transactionAnalysisService = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  log(`Connected to kafka-topic ${topic} as consumer!`);
  await consumer.run({
    eachMessage: ({ message }) => {
      const recObj = JSON.parse(message.value.toString());
      log(
        `Received message from topic "${topic}": {${recObj.payment}, ${recObj.isValid}}!`
      );
      const isAllowed = allowedValues.includes(`${recObj.isValid}`);
      if (isAllowed) {
        statistic[recObj.isValid == true ? "success" : "error"] += 1;
        statistic.total += 1;
      } else {
        log(
          `The received value does not conform to a valid format! (${recObj})`
        );
      }
      log("Current Statistic:", statistic);
    },
  });
};

module.exports = {
  transactionAnalysisService,
  log,
  err,
};
