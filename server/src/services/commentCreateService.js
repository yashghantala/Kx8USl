const connection = require('../database/db')

let createComment = function (req, res) {
    connection.query(`insert into comments (comment,userId,p_id) values('${req.body.comment}',${req.body.user_id},${req.body.comment_id ?? null})`,
        function (err, results, fields) {
            if (results.insertId > 0) {
                connection.query(
                    `select * from(select comments.id, comments.comment, comments.createdAt, users.name, count(u1.id) as total_upvotes,
                count(u2.id) > 0 as upvoted from comments 
            left join users on users.id = comments.userId
            left join upvotes u1 on u1.commentId = comments.id 
            ${req.body.user_id ? "left join upvotes u2 on comments.id=u2.commentId and u2.userId=" + req.body.user_id : ""}
            where comments.id=${results.insertId}
            GROUP BY u2.id, comments.id) as all_comments group by id limit 1; 
            `
                    , function (err, results, fields) {
                        res.json(results)
                    })
            } else {
                res.status(400).json()
            }
        })
}

exports.createComment = createComment