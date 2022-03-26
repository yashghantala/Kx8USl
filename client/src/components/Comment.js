import { useContext } from "react";
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

function Comment({ comment }) {
    const { upvoteComment } = useContext(AppContext)

    return (
        <div className="comment" data-comment-id="id">
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
                    <span onClick={() => { upvoteComment(comment.id) }} className={"comment-upvote" + (comment.upvoted ? " upvoted" : '')}><i className="fa-solid fa-circle-up"></i>
                        <span className="upvote-text"> {comment.upvoted == true ? "upvoted" : 'upvote'} </span></span>
                    <span className="comment-reply">Reply</span>
                </div>
            </div>
        </div >
    )
}

export default Comment