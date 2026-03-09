import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { Post } from "../components/Post";
import ReactMarkdown from "react-markdown";
import { CommentsBlock } from "../components/CommentsBlock";
import { useSelector } from "react-redux";

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const [comments, setComments] = React.useState([]);
  const [commentText, setCommentText] = React.useState("");
  const userData = useSelector((state) => state.auth.data);
  const navigate = useNavigate();
  const posts = useSelector((state) => state.posts.posts.items);

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

  const { id } = useParams();

  // Ielādējam pašu rakstu
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

  // Ielādējam komentārus
  React.useEffect(() => {
    axios
      .get(`/comments/post/${id}`)
      .then((res) => setComments(res.data))
      .catch((err) => console.warn(err));
  }, [id]);
  React.useEffect(() => {
    const exists = posts.find((p) => p._id === id);
    if (!exists) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, id]);

  // Pievienot jaunu komentāru
  const handleAddComment = async () => {
    try {
      const token = window.localStorage.getItem("token");

      await axios.post(
        "/comments",
        { text: commentText, postId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Pārlādējam komentārus no DB
      axios.get(`/comments/post/${id}`).then((res) => setComments(res.data));

      setCommentText("");
    } catch (err) {
      console.warn(err);
      alert("Neizdevās pievienot komentāru");
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
      {/* Komentāru sadaļa */}
      <div style={{ marginTop: 40 }}>
        <h2>Komentāri ({comments.length})</h2>

        {/* Komentāru saraksts */}
        <CommentsBlock
          items={comments}
          isLoading={false}
          currentUserId={userData?._id}
          onDelete={handleDeleteComment}
        />

        {/* Komentāru ievades forma - TAGAD ĀRPUSĒ, tūlīt zem saraksta */}
        <div
          style={{ marginTop: 20, padding: "20px", border: "1px solid #eee" }}
        >
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Raksti komentāru..."
            rows={3}
            style={{ width: "100%", padding: 10, borderRadius: "5px" }}
          />
          <button
            onClick={handleAddComment}
            style={{
              marginTop: 10,
              padding: "10px 20px",
              background: "#1976d2",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            Pievienot komentāru
          </button>
        </div>
      </div>{" "}
      {/* ŠĪ BIJA TRŪKSTOŠĀ IEKAVA, kas noslēdz komentāru sadaļu */}
    </>
  );
};
