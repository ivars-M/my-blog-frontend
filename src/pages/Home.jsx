import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { fetchPosts, fetchTags } from "../redux/slices/posts.js";
import axios from "../axios";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
// import { UsersBlock } from "../components/UsersBlock";

export const Home = () => {
  const { name } = useParams();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.data);
  const { posts, tags, searchQuery } = useSelector((state) => state.posts);

  const [tabIndex, setTabIndex] = React.useState(0);
  const [latestComments, setLatestComments] = React.useState([]);

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  // 1. Ielādējam rakstus un tagus
  React.useEffect(() => {
    dispatch(fetchPosts(name));
    dispatch(fetchTags());
  }, [name, dispatch]);

  // 2. Ielādējam pēdējos komentārus
  React.useEffect(() => {
    axios
      .get("/comments")
      .then((res) => setLatestComments(res.data))
      .catch((err) => console.warn(err));
  }, []);

  // FILTRĒŠANA UN KĀRTOŠANA
  const sortedPosts = React.useMemo(() => {
    if (!posts.items || !Array.isArray(posts.items)) return [];

    const query = searchQuery ? searchQuery.toLowerCase() : "";

    const filtered = posts.items.filter((obj) => {
      const inTitle = obj.title.toLowerCase().includes(query);
      const inTags =
        obj.tags && Array.isArray(obj.tags)
          ? obj.tags.some((tag) => tag.toLowerCase().includes(query))
          : false;
      return inTitle || inTags;
    });

    return [...filtered].sort((a, b) => {
      if (tabIndex === 0) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return b.viewsCount - a.viewsCount;
    });
  }, [posts.items, tabIndex, searchQuery]);

  return (
    <>
      {name && <h2 style={{ marginBottom: 20 }}>Raksti ar tagu: #{name}</h2>}

      <Tabs
        style={{ marginBottom: 15 }}
        value={tabIndex}
        onChange={(_, newIndex) => setTabIndex(newIndex)}
      >
        <Tab label="Jauns" />
        <Tab label="Populārs" />
      </Tabs>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {(isPostsLoading ? [...Array(5)] : sortedPosts).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={obj._id}
                id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl
                    ? obj.imageUrl.startsWith("http")
                      ? obj.imageUrl
                      : `http://localhost:4444${obj.imageUrl}`
                    : ""
                }
                isFullPost={false}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={obj.commentsCount || 0}
                tags={obj.tags}
                isEditable={userData?._id === obj.user?._id}
              />
            ),
          )}

          {!isPostsLoading && sortedPosts.length === 0 && (
            <div style={{ textAlign: "center", marginTop: 50 }}>
              <h3>Nekas netika atrasts...</h3>
            </div>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Sānjoslas secība: Tagi -> Lietotāji -> Komentāri */}
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />

          {/* <UsersBlock items={users} isLoading={isUsersLoading} /> */}

          <CommentsBlock
            items={latestComments}
            isLoading={false}
            currentUserId={userData?._id}
            onDelete={(commentId) => {
              if (window.confirm("Vai tiešām vēlies dzēst komentāru?")) {
                axios
                  .delete(`/comments/${commentId}`)
                  .then(() => {
                    setLatestComments((prev) =>
                      prev.filter((obj) => obj._id !== commentId),
                    );
                  })
                  .catch((err) => console.warn(err));
              }
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};
