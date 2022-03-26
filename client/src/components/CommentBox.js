import { useContext, useState } from "react"
import { AppContext } from "../contexts/AppContext"

function CommentBox() {
    const { createComment } = useContext(AppContext)
    const [form, setForm] = useState(false)
    const [comment, setComment] = useState("")

    let submitCheck = function (e) {
        if (e.keyCode === 13) {
            e.preventDefault()
            submitForm()
        }
    }

    let submitForm = async function () {
        if (comment == "") {
            return false
        }
        setForm(true)
        setForm(await createComment(comment))
        setComment("")
    }

    return (
        <div className="comment-box">
            <img className="img-avatar" src={process.env.PUBLIC_URL + "/images/avatar.png"} alt="user avatar" />
            <textarea value={comment} onChange={(e) => { setComment(e.target.value) }} disabled={form} onKeyDown={submitCheck} placeholder="Write your thoughts here!" name="comment" id=""></textarea>
            <button disabled={form} onClick={() => { submitForm() }} className="submit-comment" type="submit">comment</button>
        </div>
    )
}

export default CommentBox