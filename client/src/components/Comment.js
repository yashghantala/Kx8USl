import { useContext, useState } from "react";
import { AppContext } from "../contexts/AppContext";

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    }

    else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}


function Comment({ comment, reply = false }) {
    const { upvoteComment, createComment } = useContext(AppContext)
    const [replybox, setReplybox] = useState(false)
    const [cmt, setCmt] = useState('')

    let submitCheck = function (e) {
        if (e.keyCode === 13) {
            e.preventDefault()
            submitForm()
        }
    }

    let submitForm = async function () {
        if (cmt == "") {
            return false
        }
        setReplybox(false)
        await createComment(cmt, comment.id)
        setCmt("")
    }

    return (
        <div className={"comment" + (reply ? " reply" : "") + (!reply && comment.replies.length > 0 ? " has-reply" : "")}>
            <div className="user-profile">
                <img className="img-avatar" src={process.env.PUBLIC_URL + "/images/avatar.png"} alt="user avatar" />
                <div></div>
            </div>
            <div className="user-comment-details">
                <div className="comment-head">
                    <span className="user-name">{comment.name}</span>●
                    <span className="comment-timestamp">{timeDifference(new Date(), new Date(comment.createdAt))}</span>
                </div>
                <div className="comment-content">
                    {comment.comment}
                </div>
                <div className="comment-options">
                    <span onClick={() => { upvoteComment(comment.id) }} className={"comment-upvote" + (comment.upvoted ? " upvoted" : '')}>
                        <i className="fa-solid fa-circle-up"></i>
                        <span className="upvote-text"> {comment.upvoted == true ? "upvoted" : 'upvote'}</span>
                    </span>

                    {!reply && <span onClick={() => { setReplybox(!replybox) }} className={"comment-reply" + (replybox ? " open" : "")}>Reply</span>}

                    <span className="comment-reply">Upvotes:{" " + comment.total_upvotes}</span>
                </div>
                {
                    replybox && <div className="reply-box">
                        <textarea value={cmt} onChange={(e) => { setCmt(e.target.value) }} onKeyDown={submitCheck} name="reply" placeholder="Write Reply here!" />
                        <button onClick={submitForm} className="submit-comment reply">Reply</button>
                    </div>
                }
                <div className="replies">
                    {
                        !reply && comment.replies.slice(0).reverse().map((reply) => {
                            return <Comment key={reply.id} reply={true} comment={reply} />
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Comment