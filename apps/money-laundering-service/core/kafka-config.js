const host = process.env.KAFKA_HOST || "localhost";
const brokers = [`${host}:9092`];
const paymentTopic = process.env.PAYMENT_TOPIC;
const laundryCheckTopic = process.env.LAUNDRY_CHECK_TOPIC;

module.exports = {
    brokers,
    topics: {
        paymentTopic,
        laundryCheckTopic
    }
}

