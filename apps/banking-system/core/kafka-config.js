const host = process.env.KAFKA_HOST || "localhost";
const brokers = [`${host}:9092`];
const paymentTopic = process.env.PAYMENT_TOPIC;

module.exports = {
    brokers,
    topics: {
        paymentTopic,
    }
}

