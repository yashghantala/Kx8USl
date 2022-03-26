const connection = require('../database/db')

exports.upvoteComment = function (req, res) {
    connection
        .query(`select count(*) > 0 as upvoted from upvotes where userId=${req.body.user_id} and commentId=${req.body.comment_id};`,
            function (err, results, fields) {
                if (err) {
                    return res.status(400).json()
                }

                if (results[0].upvoted) {
                    connection.query(`delete from upvotes where userId=${req.body.user_id} and commentId=${req.body.comment_id};`,
                        function (err, results, fields) {
                            if (err) {
                                return res.status(400).json()
                            }

                            if (results.affectedRows > 0) {
                                res.json({
                                    upvoted: 0,
                                    ...req.body,
                                })
                            }
                        })
                } else {
                    connection.query(`insert into upvotes (userId,commentId) values(${req.body.user_id},${req.body.comment_id})`,
                        function (err, results, fields) {
                            if (err) {
                                return res.status(400).json()
                            }

                            if (results.affectedRows > 0) {
                                res.json({
                                    upvoted: 1,
                                    ...req.body,
                                })
                            }
                        })
                }
            })
}