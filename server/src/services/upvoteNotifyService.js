const { pusher } = require('../pusher/pusher')

exports.notifyUsers = function (data) {
    pusher.trigger("upvote", "update-upvote", data)
}