import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Pievienoju Link
import axios from "../axios";
import { Post } from "../components/Post";
import ReactMarkdown from "react-markdown";
// import { CommentsBlock } from "../components/CommentsBlock";
import { useSelector } from "react-redux";

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const [comments, setComments] = React.useState([]);
  const [commentText, setCommentText] = React.useState("");
  const userData = useSelector((state) => state.auth.data);
  const navigate = useNavigate();
  const posts = useSelector((state) => state.posts.posts.items);

  const { id } = useParams();

  const handleDeleteComment = async (commentId) => {
    try {
      const token = window.localStorage.getItem("token");
      await axios.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.warn(err);
      alert("Neizdevās dzēst komentāru");
    }
  };

  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("Neizdevās iegūt rakstu");
      });
  }, [id]);

  React.useEffect(() => {
    axios
      .get(`/comments/post/${id}`)
      .then((res) => setComments(res.data))
      .catch((err) => console.warn(err));
  }, [id]);

  React.useEffect(() => {
    const exists = posts.find((p) => p._id === id);
    if (!exists && !isLoading) {
      navigate("/");
    }
  }, [posts, id, isLoading, navigate]);

  const handleAddComment = async () => {
    try {
      const token = window.localStorage.getItem("token");
      if (!token) {
        alert("Komentēt var tikai reģistrēti lietotāji!");
        return;
      }

      await axios.post(
        "/comments",
        { text: commentText, postId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const res = await axios.get(`/comments/post/${id}`);
      setComments(res.data);
      setCommentText("");
    } catch (err) {
      console.warn(err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert("Komentēt var tikai reģistrēti lietotāji!");
      } else {
        alert("Neizdevās pievienot komentāru");
      }
    }
  };

  if (isLoading) {
    return <Post isLoading={true} isFullPost />;
  }

  return (
    <>
      <Post
        imageUrl={data.imageUrl}
        id={data._id}
        title={data.title}
        isFullPost={true}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={comments.length}
        tags={data.tags}
        comments={comments}
        onPostDelete={() => setComments([])}
      >
        <ReactMarkdown>{data.text}</ReactMarkdown>
      </Post>

      <div style={{ marginTop: 40 }}>
        <h2>Komentāri ({comments.length})</h2>

        

          {/* VECAIS LABAIS MAP VARIANTS */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            {comments.map((obj) => (
              <div
                key={obj._id}
                style={{
                  display: "flex",
                  gap: "15px",
                  padding: "15px",
                  borderBottom: "1px solid #eee",
                  position: "relative", // Nepieciešams, lai poga "peldētu" malā
                }}
              >
                <img
                  src={obj.user.avatarUrl || "/noavatar.png"}
                  alt={obj.user.fullName}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <b style={{ fontSize: "14px" }}>{obj.user.fullName}</b>
                  <p
                    style={{
                      margin: "5px 0 0",
                      fontSize: "15px",
                      color: "#333",
                    }}
                  >
                    {obj.text}
                  </p>
                </div>

                {/* DZĒŠANAS POGA - parādās tikai Stārķim (autoram) */}
                {userData?._id === obj.user._id && (
                  <button
                    onClick={() => handleDeleteComment(obj._id)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "10px",
                      background: "none",
                      border: "none",
                      color: "#ff4d4f",
                      cursor: "pointer",
                      fontSize: "18px",
                      fontWeight: "bold",
                      opacity: 0.6,
                    }}
                    title="Dzēst komentāru"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Šeit paliek tava esošā textarea un pievienošanas poga */}
          {/* ... (tavs iepriekšējais kods ar textarea) ... */}
        

        {/* --- IZLABOTĀ DAĻA: PĀRBAUDE VAI LIETOTĀJS IR IELOGOJIES --- */}
        {!userData ? (
          <div
            style={{
              marginTop: 20,
              padding: "20px",
              border: "1px dashed #ccc",
              borderRadius: "10px",
              textAlign: "center",
              background: "#f9f9f9",
            }}
          >
            <p style={{ marginBottom: 10 }}>
              Tikai reģistrēti lietotāji var pievienot komentārus.
            </p>
            <Link
              to="/login"
              style={{
                color: "#1976d2",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Ielogoties
            </Link>
          </div>
        ) : (
          <div
            style={{
              marginTop: 20,
              padding: "20px",
              border: "1px solid #eee",
              background: "#fff",
              borderRadius: "10px",
            }}
          >
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Raksti komentāru..."
              rows={3}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              style={{
                marginTop: 10,
                padding: "10px 20px",
                background: commentText.trim() ? "#1976d2" : "#ccc",
                color: "white",
                border: "none",
                cursor: commentText.trim() ? "pointer" : "default",
                borderRadius: "5px",
                fontWeight: "bold",
              }}
            >
              Pievienot komentāru
            </button>
          </div>
        )}
      </div>
    </>
  );
};
