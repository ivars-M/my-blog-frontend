import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../axios";
import { Post } from "../components/Post";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import styles from "./FullPost.module.scss"; // IMPORTĒJAM STILUS

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const [comments, setComments] = React.useState([]);
  const [commentText, setCommentText] = React.useState("");
  const [editingCommentId, setEditingCommentId] = React.useState(null); // Jaunais stāvoklis rediģēšanai

  const userData = useSelector((state) => state.auth.data);
  const navigate = useNavigate();
  // const posts = useSelector((state) => state.posts.posts.items);
  const { id } = useParams();

  // DZĒŠANA
  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Vai tiešām vēlies dzēst šo komentāru?")) {
      try {
        await axios.delete(`/comments/${commentId}`);
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      } catch (err) {
        console.warn(err);
        alert("Neizdevās dzēst komentāru");
      }
    }
  };

  // REDIĢĒŠANAS UZSĀKŠANA
  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setCommentText(comment.text);
    // Nobīdām skatu uz textarea
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  // DATU IEGŪŠANA
  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        navigate("/");
      });

    axios.get(`/comments/post/${id}`).then((res) => {
      setComments(res.data);
    });
  }, [id, navigate]);

  // PIEVIENOŠANA VAI ATJAUNOŠANA
  const handleAddComment = async () => {
    try {
      if (editingCommentId) {
        // Rediģēšanas loģika
        await axios.patch(`/comments/${editingCommentId}`, {
          text: commentText,
        });
        setEditingCommentId(null);
      } else {
        // Jauna komentāra loģika
        await axios.post("/comments", { text: commentText, postId: id });
      }

      const res = await axios.get(`/comments/post/${id}`);
      setComments(res.data);
      setCommentText("");
    } catch (err) {
      console.warn(err);
      alert("Neizdevās saglabāt komentāru");
    }
  };

  if (isLoading) return <Post isLoading={true} isFullPost />;

  return (
    <>
      <Post
        imageUrl={data.imageUrl}
        id={data._id}
        title={data.title}
        isFullPost
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={comments.length}
        tags={data.tags}
      >
        <ReactMarkdown>{data.text}</ReactMarkdown>
      </Post>

      <div style={{ marginTop: 40 }}>
        <h2>Komentāri ({comments.length})</h2>

        <div className={styles.commentsWrapper}>
          {comments.map((obj) => (
            <div key={obj._id} className={styles.commentItem}>
              <img
                className={styles.avatar}
                src={obj.user.avatarUrl || "/noavatar.png"}
                alt={obj.user.fullName}
              />
              <div className={styles.commentBody}>
                <b>{obj.user.fullName}</b>
                <p>{obj.text}</p>
              </div>

              {userData?._id === obj.user._id && (
                <div className={styles.editControls}>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEditComment(obj)}
                    title="Rediģēt"
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteComment(obj._id)}
                    title="Dzēst"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {!userData ? (
          <div className={styles.authPrompt}>
            <p>Tikai reģistrēti lietotāji var pievienot komentārus.</p>
            <Link to="/login">Ielogoties</Link>
          </div>
        ) : (
          <div className={styles.addCommentBlock}>
            <h3>
              {editingCommentId ? "Rediģēt komentāru" : "Pievienot komentāru"}
            </h3>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Raksti komentāru..."
              rows={3}
            />
            <button
              className={styles.submitBtn}
              onClick={handleAddComment}
              disabled={!commentText.trim()}
            >
              {editingCommentId ? "Saglabāt izmaiņas" : "Pievienot komentāru"}
            </button>
            {editingCommentId && (
              <button
                onClick={() => {
                  setEditingCommentId(null);
                  setCommentText("");
                }}
                style={{
                  marginLeft: 10,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                Atcelt
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};
