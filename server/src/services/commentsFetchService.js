const connection = require("../database/db");

let fetchComment = function (req, res) {
  let user_id = req.query.user_id ?? 0
  connection.query(
    // `select * from (select comments.id,comments.comment,comments.createdAt,users.name,count(u1.id) as total_upvotes,count(u2.id) > 0 as upvoted from comments left join users on users.id=comments.userId left join upvotes u1 on u1.commentId=comments.id left join upvotes u2 on comments.id=u2.commentId and u2.userId=${user_id} GROUP BY u2.id,comments.id) as all_comments group by id;`,
    `select c1.id, c1.comment, c1.createdAt, c1.name, c1.total_upvotes, c1.upvoted, c2.id as r_id, c2.p_id as r_p_id, c2.comment as r_comment, c2.createdAt as r_createdAt, c2.name as r_name, c2.total_upvotes as r_total_upvotes, c2.upvoted as r_upvoted from (select comments.id,comments.comment,comments.createdAt,users.name,count(u1.id) as total_upvotes, count(u2.id) > 0 as upvoted from comments 
    left join users on users.id=comments.userId
    left join upvotes u1 on u1.commentId=comments.id 
    left join upvotes u2 on comments.id=u2.commentId and u2.userId=${user_id}
    where comments.p_id is null
    GROUP BY comments.id) as c1
    left join (select * from (select comments.id,comments.p_id,comments.comment,comments.createdAt,users.name,count(u1.id) as total_upvotes, count(u2.id) > 0 as upvoted from comments 
    left join users on users.id=comments.userId
    left join upvotes u1 on u1.commentId=comments.id 
    left join upvotes u2 on comments.id=u2.commentId and u2.userId=${user_id}
    where comments.p_id is not null
    GROUP BY comments.id) as all_comments) as c2 on c1.id=c2.p_id;`,
    function (err, results, fields) {
      if (!err) {
        let comments = []
        results.forEach((comment) => {
          // Get an existing comment if available otherwise push on Array
          let currentIndex = comments.findIndex((elmnt) => comment.id == elmnt.id)

          if (currentIndex == -1) {
            let cmnt = {
              id: comment.id,
              comment: comment.comment,
              createdAt: comment.createdAt,
              name: comment.name,
              total_upvotes: comment.total_upvotes,
              upvoted: comment.upvoted,
              replies: []
            }
            currentIndex = comments.push(cmnt) - 1
          }

          // push replies to its original comment
          if (comment.r_id) {
            comments[currentIndex].replies.push({
              id: comment.r_id,
              p_id: comment.r_p_id,
              comment: comment.r_comment,
              createdAt: comment.r_createdAt,
              name: comment.r_name,
              total_upvotes: comment.r_total_upvotes,
              upvoted: comment.r_upvoted,
            })
          }
        })
        return res.json(comments)
      } else {
        return res.status(400)
      }
    }
  )
}

exports.fetchComment = fetchComment
