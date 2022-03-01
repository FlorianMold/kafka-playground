const { Kafka } = require("kafkajs");
const { brokers, topics } = require("./core/kafka-config");
const logger = require("./core/logger");

const clientId = "money-laundering-service";
const log = logger(clientId);
const err = logger(clientId, console.error);
const receiveTopic = topics.paymentTopic;
const sendTopic = topics.laundryCheckTopic;

const kafka = new Kafka({ clientId, brokers });
const consumer = kafka.consumer({ groupId: clientId });
const producer = kafka.producer();

let uniqueId = 1;

/**
 * Creates the money-laundering service, which consumes payments from the payments-topic and
 * sends messages to the laundry-check topic.
 *
 * @return {Promise<void>}
 */
const moneyLaunderingService = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: receiveTopic, fromBeginning: true });
  log(`Connected to kafka-topic ${receiveTopic} as consumer!`);
  await producer.connect();
  log(`Connected to kafka-topic ${sendTopic} as producer!`);
  await consumer.run({
    eachMessage: async ({ message }) => {
      log(`Received payment ${message.value} from "topic" ${receiveTopic}!`);
      const isValid = isValidTransaction(message.value);
      await produceMessage(isValid);
    },
  });
};

/**
 * Produces a message with the given value and sends it to the laundry-check topic.
 *
 * @param value Value to check.
 * @return {Promise<void>}
 */
const produceMessage = async (value) => {
  try {
    await producer.send({
      topic: sendTopic,
      messages: [
        {
          key: `${uniqueId++}`,
          value: `${value}`,
        },
      ],
    });
    log(`Published value "${value}" to ${sendTopic}!`);
  } catch (err) {
    err(`Couldn't write to ${sendTopic}: `, err);
  }
};

/**
 * Checks whether the given amount is a valid transaction.
 *
 * @param amount Amount to check.
 * @return {boolean}
 */
const isValidTransaction = (amount) => amount > 1000;

module.exports = {
  moneyLaunderingService,
  log,
  err,
};
