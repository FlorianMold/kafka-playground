const { Kafka } = require("kafkajs");
const { topics, brokers } = require("./core/kafka-config");
const logger = require("./core/logger");

const clientId = "banking-system";
const topic = topics.paymentTopic;
const log = logger(clientId);
const err = logger(clientId, console.error);

const kafka = new Kafka({ clientId, brokers });
const producer = kafka.producer();

let uniqueId = 1;

const generateRandomNumber = (maxNumber = 2000) =>
  Math.round(Math.random() * maxNumber);

/**
 * Creates a producer
 * @param fn Function which sends a message to kafka
 * @param interval int Interval in ms in which the messages are sent
 * @return {Promise<void>}
 */
const createStream = async (fn, interval) => {
  await producer.connect();
  log(`Connected to kafka-topic ${topic} as producer!`);
  setInterval(fn, interval);
};

/**
 * Sends a message with a unique payment to kafka.
 *
 * @return {Promise<void>}
 */
const sendMessage = async () => {
  const payment = generateRandomNumber();
  try {
    await producer.send({
      topic,
      messages: [
        {
          key: `${uniqueId++}`,
          value: `${payment}`,
        },
      ],
    });
    log(`Published payment "${payment}" to ${topic}!`);
  } catch (err) {
    err(`Couldn't write to ${topic}: `, err);
  }
};

/**
 * Produces payments into kafka.
 *
 * @param interval interval, in which the messages are produced.
 * @return {Promise<void>}
 */
const bankingService = async (interval = 10000) => {
  return createStream(sendMessage, interval);
};

module.exports = {
  bankingService,
  log,
  err,
};
