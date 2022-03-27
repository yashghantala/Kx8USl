import { useCallback, useEffect, useState } from "react";
import Container from "./components/Container"
import UserCard from "./components/UserCard"
import { AppContext } from "./contexts/AppContext"
import Pusher from "pusher-js"
import './App.css';

function App() {
  const [user, setUser] = useState(1)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([])
  const serverUrl = process.env.REACT_APP_API_SERVER_URL

  let onUserChange = function (e) {
    setUser(e.target.value)
  }

  let upvoteComment = function (comment_id) {
    fetch(serverUrl + "/comments/upvote", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        user_id: user,
        comment_id: comment_id
      })
    })
    // .then(res => {
    //   return res.json()
    // }).then(res => {
    //   let upvoted = comments.map((comment) => {
    //     if (comment.id == res.comment_id) {
    //       comment.upvoted = res.upvoted
    //     }
    //     return comment
    //   })
    //   setComments(upvoted)
    // })
  }

  let createComment = async function (comment) {
    await fetch(serverUrl + "/comments/create", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        user_id: user,
        comment: comment
      })
    }).then(res => {
      return res.json()
    }).then(res => {
      setComments([...comments, res[0]])
    })
    return false
  }

  let upvote = useCallback((upvote) => {

    let cmt = comments.map((comment) => {
      if (comment.id == upvote.comment_id) {
        if (upvote.user_id == user) {
          comment.upvoted = upvote.upvoted
        }
        if (upvote.upvoted) {
          comment.total_upvotes += 1
        } else {
          comment.total_upvotes -= 1
        }
      }
      return comment
    })

    setComments(cmt)

  }, [comments, user])

  useEffect(function () {
    fetch(serverUrl + "/comments/get?user_id=" + user).then(function (res) {
      return res.json()
    }).then(function (res) {
      setComments(res)
    }).then(() => {
      setLoading(false)
    })
  }, [user, serverUrl])

  useEffect(() => {

    var pusher = new Pusher('64a053b9428aacb2b0d9', {
      cluster: 'ap2'
    })
    var channel = pusher.subscribe('upvote')

    channel.bind('update-upvote', function (data) {
      upvote(data)
    })

    return () => {
      pusher.unsubscribe('upvote')
    }
  }, [upvote])

  return (
    <>
      <AppContext.Provider value={{ comments, user, loading, upvoteComment, createComment }}>
        <UserCard userChanged={onUserChange} />
        <Container />
      </AppContext.Provider>
    </>
  );
}

export default App;

