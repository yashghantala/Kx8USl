import { useContext, useEffect } from "react"
import { AppContext } from "../contexts/AppContext"
import Comment from "./Comment"
import CommentBox from "./CommentBox"
import Loading from "./loading"

function Container() {
    const { loading, comments } = useContext(AppContext)

    return (
        <div className="main">
            <div className="container">

                <div className="title-heading">
                    <span>Discussion</span>
                </div>

                <CommentBox />

                <div className="divider-line"></div>

                <div className={"comments" + (loading ? ' d-none' : '')}>
                    <div className="comment-list">
                        {comments.slice(0).reverse().map((comment) => {
                            return <Comment key={comment.id} comment={comment} />
                        })}
                    </div>
                </div>

                {loading ? <Loading /> : null}
            </div>
        </div >
    )
}

export default Container