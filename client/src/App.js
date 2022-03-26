import { useEffect, useState } from "react";
import Container from "./components/Container"
import UserCard from "./components/UserCard"
import { AppContext } from "./contexts/AppContext"
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
    }).then(res => {
      return res.json()
    }).then(res => {
      let upvoted = comments.map((comment) => {
        if (comment.id == res.comment_id) {
          comment.upvoted = res.upvoted
        }
        return comment
      })
      setComments(upvoted)
    })
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

  useEffect(function () {
    fetch(serverUrl + "/comments/get?user_id=" + user).then(function (res) {
      return res.json()
    }).then(function (res) {
      setComments(res)
    }).then(() => {
      setLoading(false)
    })
  }, [user])

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
