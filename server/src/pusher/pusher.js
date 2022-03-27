const Pusher = require("pusher")

exports.pusher = new Pusher({
    appId: "1367876",
    key: "64a053b9428aacb2b0d9",
    secret: "2871e929d01475ec2449",
    cluster: "ap2",
    useTLS: true
})

