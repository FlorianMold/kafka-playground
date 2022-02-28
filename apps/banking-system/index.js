const {bankingService, log, err} = require("./banking-system-service");

const timingInterval = process.env.TIMING_INTERVAL || 10000

bankingService(timingInterval)
    .catch(() => err('Error producing payments!'))

setInterval(() => {
    log('Doing something else!')
}, timingInterval)
