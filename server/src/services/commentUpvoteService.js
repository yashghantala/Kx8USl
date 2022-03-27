const connection = require('../database/db')
const { notifyUsers } = require('../services/upvoteNotifyService')

let upvoteComment = function (req, res) {
    connection
        .query(`select count(*) > 0 as upvoted from upvotes where userId=${req.body.user_id} and commentId=${req.body.comment_id};`,
            function (err, results, fields) {
                if (err) {
                    return res.status(400).json()
                }

                //down vote if VOTED
                if (results[0].upvoted) {
                    connection.query(`delete from upvotes where userId=${req.body.user_id} and commentId=${req.body.comment_id};`,
                        function (err, results, fields) {
                            if (err) {
                                return res.status(400).json()
                            }

                            if (results.affectedRows > 0) {
                                notifyUsers({
                                    upvoted: 0,
                                    ...req.body
                                })
                                return res.end()
                            }
                        })
                } else {
                    //up vote if not VOTED
                    connection.query(`insert into upvotes (userId,commentId) values(${req.body.user_id},${req.body.comment_id})`,
                        function (err, results, fields) {
                            if (err) {
                                return res.status(400).json()
                            }

                            if (results.affectedRows > 0) {
                                notifyUsers({
                                    upvoted: 1,
                                    ...req.body
                                })
                                return res.end()
                            }
                        })
                }
            })
}

exports.upvoteComment = upvoteComment