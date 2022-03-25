// Services
const { createComment } = require('../services/commentCreateService')
const { fetchComment } = require('../services/commentsFetchService')
const { upvoteComment } = require('../services/commentUpvoteService')

exports.comment_create = createComment

exports.comment_get_all = fetchComment

exports.comment_upvote = upvoteComment